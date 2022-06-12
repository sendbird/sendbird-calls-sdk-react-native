import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Platform } from 'react-native';

import { SendbirdCalls } from '@sendbird/calls-react-native';

import { useAuthContext } from '../shared/contexts/AuthContext';
import AuthManager from '../shared/libs/AuthManager';
import {
  setFirebaseMessageHandlers,
  setNotificationForegroundService,
  startRingingWithNotification,
} from './callHandler/android';
import { setupCallKit, startRingingWithCallKit } from './callHandler/ios';
import { DirectRoutes } from './navigations/routes';
import DirectCallHomeTab from './screens/DirectCallHomeTab';
import DirectCallSignInScreen from './screens/DirectCallSignInScreen';
import DirectCallVideoCallingScreen from './screens/DirectCallVideoCallingScreen';
import DirectCallVoiceCallingScreen from './screens/DirectCallVoiceCallingScreen';

if (Platform.OS === 'android') {
  setFirebaseMessageHandlers();
  setNotificationForegroundService();
}

if (Platform.OS === 'ios') {
  setupCallKit();
}

SendbirdCalls.onRinging(async (call) => {
  const directCall = await SendbirdCalls.getDirectCall(call.callId);

  if (!SendbirdCalls.currentUser) {
    const credential = await AuthManager.getSavedCredential();

    if (credential) {
      // Authenticate before accept
      await SendbirdCalls.authenticate(credential.userId, credential.accessToken);
    } else {
      // Invalid user call
      return directCall.end();
    }
  }

  // Show interaction UI (Accept/Decline)
  if (Platform.OS === 'android') startRingingWithNotification(call);
  if (Platform.OS === 'ios') startRingingWithCallKit(call);
});

export const Stack = createNativeStackNavigator();

const DirectCallApp = () => {
  const { currentUser } = useAuthContext();

  return (
    <Stack.Navigator>
      {!currentUser ? (
        <Stack.Screen
          name={DirectRoutes.SIGN_IN}
          component={DirectCallSignInScreen}
          options={{ headerTitleAlign: 'center', headerTitle: 'Sign in' }}
        />
      ) : (
        <>
          <Stack.Screen name={DirectRoutes.HOME_TAB} component={DirectCallHomeTab} options={{ headerShown: false }} />
          <Stack.Group screenOptions={{ headerShown: false, gestureEnabled: false }}>
            <Stack.Screen name={DirectRoutes.VIDEO_CALLING} component={DirectCallVideoCallingScreen} />
            <Stack.Screen name={DirectRoutes.VOICE_CALLING} component={DirectCallVoiceCallingScreen} />
          </Stack.Group>
        </>
      )}
    </Stack.Navigator>
  );
};

export default DirectCallApp;
