import Notifee, { AndroidImportance } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { SendbirdCalls } from '@sendbird/calls-react-native';

import { useAuthContext } from '../shared/contexts/AuthContext';
import { DirectRoutes } from './navigations/directRoutes';
import DirectCallScreen from './screens/DirectCallScreen';
import DirectCallSignInScreen from './screens/DirectCallSignInScreen';

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

export const Stack = createNativeStackNavigator();

const DirectCallApp = () => {
  const { currentUser } = useAuthContext();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!currentUser ? (
        <Stack.Screen name={DirectRoutes.SIGN_IN} component={DirectCallSignInScreen} />
      ) : (
        <>
          <Stack.Screen name={DirectRoutes.DIRECT_CALL} component={DirectCallScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default DirectCallApp;
