import RNCallKeep from 'react-native-callkeep';
import RNVoipPushNotification from 'react-native-voip-push-notification';

import { DirectCallProperties, SendbirdCalls } from '@sendbird/calls-react-native';

import { RunAfterAppReady } from '../../shared/libs/StaticNavigation';
import { AppLogger } from '../../shared/utils/logger';
import { DirectRouteWithParams, DirectRoutes } from '../navigations/routes';

export const setCallKitListeners = async () => {
  await RNCallKeep.setup({
    ios: {
      appName: 'SendbirdCalls RN',
      supportsVideo: true,
      maximumCallGroups: '1',
      maximumCallsPerCallGroup: '1',
      includesCallsInRecents: true,
    },
    android: {
      alertTitle: 'noop',
      alertDescription: 'noop',
      cancelButton: 'noop',
      okButton: 'noop',
      additionalPermissions: [],
    },
  });

  RNCallKeep.addEventListener('answerCall', async ({ callUUID }) => {
    const directCall = await SendbirdCalls.getDirectCall(callUUID);
    AppLogger.debug('[CALL START]', directCall.callId);
    RunAfterAppReady<DirectRoutes, DirectRouteWithParams>((navigation) => {
      if (directCall.isVideoCall) {
        navigation.navigate(DirectRoutes.VIDEO_CALLING, { callId: directCall.callId });
      } else {
        navigation.navigate(DirectRoutes.VOICE_CALLING, { callId: directCall.callId });
      }
      directCall.accept();
    });
  });

  RNCallKeep.addEventListener('endCall', async ({ callUUID }) => {
    const directCall = await SendbirdCalls.getDirectCall(callUUID);
    AppLogger.debug('[CALL END]', directCall.callId);
    await directCall.end();
  });

  return () => {
    RNCallKeep.removeEventListener('answerCall');
    RNCallKeep.removeEventListener('endCall');
  };
};

export const startRingingWithCallKit = async (props: DirectCallProperties) => {
  if (props.remoteUser && props.ios_callUUID) {
    AppLogger.debug('Report incoming call');
    const uuid = props.ios_callUUID;
    const remoteUser = props.remoteUser;
    const directCall = await SendbirdCalls.getDirectCall(props.callId);

    RNCallKeep.displayIncomingCall(
      uuid,
      remoteUser.userId,
      remoteUser.nickname ?? 'Unknown',
      'generic',
      props.isVideoCall,
    );

    RNVoipPushNotification.onVoipNotificationCompleted(props.ios_callUUID);

    // Accept only one ongoing call
    const onGoingCalls = await SendbirdCalls.getOngoingCalls();
    if (onGoingCalls.length > 1) {
      AppLogger.warn('Ongoing calls:', onGoingCalls.length);
      directCall.end();
      RNCallKeep.rejectCall(uuid);
      return;
    }

    const unsubscribe = directCall.addListener({
      onEnded({ callLog }) {
        AppLogger.warn('onEnded with callkit');
        RNCallKeep.endAllCalls();
        if (callLog?.endedBy?.userId === remoteUser.userId) {
          RNCallKeep.reportEndCallWithUUID(uuid, 2);
        }
        unsubscribe();
      },
    });
  }
};
