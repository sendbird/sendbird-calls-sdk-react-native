import Notifee, { AndroidForegroundServiceType, AndroidImportance } from '@notifee/react-native';
import { Event, EventType } from '@notifee/react-native/src/types/Notification';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

import { DirectCallProperties, SendbirdCalls } from '@sendbird/calls-react-native';

import { RunAfterAppReady } from '../../shared/libs/StaticNavigation';
import { AppLogger } from '../../shared/utils/logger';
import { DirectRouteWithParams, DirectRoutes } from '../navigations/routes';

/** Firebase RemoteMessage handler **/
export function setFirebaseMessageHandlers() {
  const firebaseListener = async (message: FirebaseMessagingTypes.RemoteMessage) => {
    SendbirdCalls.android_handleFirebaseMessageData(message.data);
  };
  const messaging = getMessaging();
  messaging.setBackgroundMessageHandler(firebaseListener);
  onMessage(messaging, firebaseListener);
}

/** Notifee ForegroundService with Notification */
export const NOTIFICATION_CHANNEL_ID = 'sendbird.calls.rn.ringing';

export async function setNotificationForegroundService() {
  // Create channel
  await Notifee.createChannel({ name: 'Ringing', id: NOTIFICATION_CHANNEL_ID, importance: AndroidImportance.HIGH });

  // Register foreground service, NOOP
  Notifee.registerForegroundService(async (notification) => new Promise(() => notification));

  // Register notification listeners
  const onNotificationAction = async ({ type, detail }: Event) => {
    if (type !== EventType.ACTION_PRESS || !detail.notification?.data?.call) return;

    const callProps = JSON.parse(detail.notification.data.call as string) as DirectCallProperties;

    const directCall = await SendbirdCalls.getDirectCall(callProps.callId);
    if (directCall.isEnded) {
      AppLogger.warn('Call is already ended:', directCall.callId);
      return Notifee.stopForegroundService();
    }

    if (detail.pressAction?.id === 'accept') {
      AppLogger.info('[CALL START]', directCall.callId);
      RunAfterAppReady<DirectRoutes, DirectRouteWithParams>((navigation) => {
        if (directCall.isVideoCall) {
          navigation.navigate(DirectRoutes.VIDEO_CALLING, { callId: directCall.callId });
        } else {
          navigation.navigate(DirectRoutes.VOICE_CALLING, { callId: directCall.callId });
        }
        directCall.accept();
      });
    } else if (detail.pressAction?.id === 'decline') {
      AppLogger.warn('[CALL END]', directCall.callId);
      await directCall.end();
    }
  };

  Notifee.onBackgroundEvent(onNotificationAction);
  Notifee.onForegroundEvent(onNotificationAction);
}

export async function startRingingWithNotification(call: DirectCallProperties) {
  const directCall = await SendbirdCalls.getDirectCall(call.callId);
  const callType = call.isVideoCall ? 'Video' : 'Voice';

  // Accept only one ongoing call
  const onGoingCalls = await SendbirdCalls.getOngoingCalls();
  if (onGoingCalls.length > 1) {
    AppLogger.warn('Ongoing calls:', onGoingCalls.length);
    return directCall.end();
  }

  // Display Notification for action
  await Notifee.displayNotification({
    id: call.callId,
    title: `${callType} Call from ${call.remoteUser?.nickname ?? 'Unknown'}`,
    data: { call: JSON.stringify(call) },
    android: {
      asForegroundService: true,
      foregroundServiceTypes: [AndroidForegroundServiceType.FOREGROUND_SERVICE_TYPE_MICROPHONE],
      channelId: NOTIFICATION_CHANNEL_ID,
      actions: [
        { title: 'Accept', pressAction: { id: 'accept', launchActivity: 'default' } },
        { title: 'Decline', pressAction: { id: 'decline' } },
      ],
    },
  });

  const unsubscribe = directCall.addListener({
    // Update notification on established
    onEstablished() {
      const callType = directCall.isVideoCall ? 'Video' : 'Voice';
      return Notifee.displayNotification({
        id: call.callId,
        title: `${callType} Call with ${directCall.remoteUser?.nickname ?? 'Unknown'}`,
        data: { call: JSON.stringify(call) },
        android: {
          asForegroundService: true,
          foregroundServiceTypes: [AndroidForegroundServiceType.FOREGROUND_SERVICE_TYPE_MICROPHONE],
          channelId: NOTIFICATION_CHANNEL_ID,
          actions: [{ title: 'End', pressAction: { id: 'decline' } }],
          timestamp: Date.now(),
          showTimestamp: true,
          showChronometer: true,
        },
      });
    },
    // Remove notification on ended
    onEnded() {
      Notifee.stopForegroundService();
      unsubscribe();
    },
  });
}
