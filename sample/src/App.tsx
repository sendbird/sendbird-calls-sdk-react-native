import Notifee, { AndroidImportance } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { SendbirdCalls } from '@sendbird/calls-react-native';

import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { APP_ID, INITIAL_ROUTE } from './env';
import { RootStack } from './libs/factory';
import { Routes } from './libs/routes';
import SignInScreen from './screens/SignInScreen';
import DirectCallScreen from './screens/direct-call/DirectCallScreen';
import GroupCallScreen from './screens/group-call/GroupCallScreen';

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
        id: String(call.callId),
        title: message.data?.message ?? `Call from ${call.remoteUser?.nickname}`,
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
    detail.notification?.data;
  }

  if (detail.pressAction?.id === 'decline') {
  }
});

export default function App() {
  return (
    <AuthProvider>
      <Navigations />
    </AuthProvider>
  );
}

const Navigations = () => {
  const { currentUser } = useAuthContext();
  const Direct = <RootStack.Screen name={Routes.DIRECT_CALL} component={DirectCallScreen} />;
  const Group = <RootStack.Screen name={Routes.GROUP_CALL} component={GroupCallScreen} />;

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {!currentUser ? (
          <RootStack.Screen name={Routes.SIGN_IN} component={SignInScreen} />
        ) : (
          <>
            {INITIAL_ROUTE === Routes.DIRECT_CALL ? Direct : Group}
            {INITIAL_ROUTE === Routes.DIRECT_CALL ? Group : Direct}
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
