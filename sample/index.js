import Notifee, { AndroidImportance } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import { withTouchReload } from 'react-native-touch-reload';

import { SendbirdCalls } from '@sendbird/calls-react-native';

import { name as appName } from './app.json';
import App from './src/App';
import { APP_ID } from './src/env';

SendbirdCalls.Logger.setLogLevel('debug');
SendbirdCalls.initialize(APP_ID);

messaging().setBackgroundMessageHandler(async (message) => {
  const isSendbirdCalls = SendbirdCalls.android_handleFirebaseMessageData(message.data);
  if (isSendbirdCalls) {
    SendbirdCalls.onRinging(async (call) => {
      const channelId = await Notifee.createChannel({
        name: 'Ringing',
        id: 'sendbird.calls.rn.ringing',
        importance: AndroidImportance.HIGH,
      });
      await Notifee.displayNotification({
        id: call.callId,
        title: message.data?.message ?? `Call from ${call.remoteUser?.nickname ?? 'Unknown'}`,
        data: message.data,
        android: {
          asForegroundService: true,
          channelId,
          actions: [
            {
              title: 'Accept',
              pressAction: {
                id: 'accept',
                launchActivity: 'default',
              },
            },
            {
              title: 'Decline',
              pressAction: {
                id: 'decline',
                launchActivity: 'default',
              },
            },
          ],
        },
      });
    });
  }
});

Notifee.onBackgroundEvent(async ({ detail }) => {
  if (detail.pressAction?.id === 'accept') {
    //
  }

  if (detail.pressAction?.id === 'decline') {
    //
  }
});

AppRegistry.registerComponent(appName, () => withTouchReload(App));
