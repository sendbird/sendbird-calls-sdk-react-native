import Notifee, { AndroidImportance } from '@notifee/react-native';
import { Event, EventType } from '@notifee/react-native/src/types/Notification';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

import { DirectCallProperties, SendbirdCalls } from '@sendbird/calls-react-native';

import { AppLogger } from '../../shared/utils/logger';

/** Firebase RemoteMessage handler **/
export function setFirebaseMessageHandlers() {
  const firebaseListener = async (message: FirebaseMessagingTypes.RemoteMessage) => {
    SendbirdCalls.android_handleFirebaseMessageData(message.data);
  };
  messaging().setBackgroundMessageHandler(firebaseListener);
  messaging().onMessage(firebaseListener);
}

/** Notifee ForegroundService with Notification */
export const NOTIFICATION_CHANNEL_ID = 'sendbird.calls.rn.ringing';
const FOREGROUND_SERVICE_NOTIFICATION_ID = 'sendbird.calls.rn.foreground.notification';
export async function setNotificationForegroundService() {
  // Create channel
  await Notifee.createChannel({ name: 'Ringing', id: NOTIFICATION_CHANNEL_ID, importance: AndroidImportance.HIGH });

  // Register foreground service, NOOP
  Notifee.registerForegroundService(async (notification) => new Promise(() => notification));

  // Register notification listeners
  const onNotificationAction = async ({ type, detail }: Event) => {
    if (type !== EventType.ACTION_PRESS || !detail.notification?.data?.call) return;

    const callString = detail.notification.data.call;
    const callProps: DirectCallProperties = JSON.parse(callString);

    const directCall = await SendbirdCalls.getDirectCall(callProps.callId);
    if (directCall.isEnded) AppLogger.warn('Call is already ended:', directCall.callId);

    if (detail.pressAction?.id === 'accept') {
      AppLogger.debug('[CALL START]', directCall.callId);
      await directCall.accept().then(() => {
        const callType = directCall.isVideoCall ? 'Video' : 'Voice';
        return Notifee.displayNotification({
          ...detail.notification,
          title: `${callType} Call with ${directCall.remoteUser?.nickname ?? 'Unknown'}`,
          android: {
            asForegroundService: true,
            channelId: NOTIFICATION_CHANNEL_ID,
            actions: [{ title: 'End', pressAction: { id: 'decline' } }],
            timestamp: Date.now(),
            showTimestamp: true,
            showChronometer: true,
          },
        });
      });
    } else if (detail.pressAction?.id === 'decline') {
      AppLogger.warn('[CALL END]', directCall.callId);
      directCall.end();
    }
  };

  Notifee.onBackgroundEvent(onNotificationAction);
  Notifee.onForegroundEvent(onNotificationAction);
}

export async function startRingingWithNotification(call: DirectCallProperties) {
  const onGoingCalls = await SendbirdCalls.getOngoingCalls();
  const directCall = await SendbirdCalls.getDirectCall(call.callId);

  // Accept only 1 call
  if (onGoingCalls.length >= 2) {
    AppLogger.warn('Ongoing calls:', onGoingCalls.length);
    return directCall.end();
  }

  const callType = call.isVideoCall ? 'Video' : 'Voice';

  // Start Notification as foreground service
  await Notifee.displayNotification({
    //NOTE: all foreground service notification id is same, if difference registerForegroundService called multiple times
    id: FOREGROUND_SERVICE_NOTIFICATION_ID,
    title: `${callType} Call from ${call.remoteUser?.nickname ?? 'Unknown'}`,
    data: { call: JSON.stringify(call) },
    android: {
      asForegroundService: true,
      channelId: NOTIFICATION_CHANNEL_ID,
      actions: [
        { title: 'Accept', pressAction: { id: 'accept', launchActivity: 'default' } },
        { title: 'Decline', pressAction: { id: 'decline', launchActivity: 'default' } },
      ],
    },
  });

  // Remove service on call ended
  const unsubscribe = directCall.addListener({
    onEnded() {
      Notifee.stopForegroundService();
      unsubscribe();
    },
  });
}
