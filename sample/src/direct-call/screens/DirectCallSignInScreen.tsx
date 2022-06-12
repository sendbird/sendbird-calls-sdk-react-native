import messaging from '@react-native-firebase/messaging';
import React, { useReducer } from 'react';
import { Platform, ScrollView } from 'react-native';

import { SendbirdCalls } from '@sendbird/calls-react-native';

import { APP_ID } from '../../env';
import SignInForm from '../../shared/components/SignInForm';
import { useAuthContext } from '../../shared/contexts/AuthContext';
import { useLayoutEffectAsync } from '../../shared/hooks/useEffectAsync';
import AuthManager from '../../shared/libs/AuthManager';
import TokenManager from '../../shared/libs/TokenManager';
import { AppLogger } from '../../shared/utils/logger';

type Input = {
  applicationId: string;
  userId: string;
  accessToken?: string;
};
const DirectCallSignInScreen = () => {
  const { setCurrentUser } = useAuthContext();
  const [state, setState] = useReducer((prev: Input, next: Partial<Input>) => ({ ...prev, ...next }), {
    applicationId: APP_ID,
    userId: 'DirectCall_' + Platform.OS,
    accessToken: '',
  });

  useLayoutEffectAsync(async () => {
    const credential = await AuthManager.getSavedCredential();
    if (credential) onSignIn(credential);
  }, []);

  const authenticate = async (value: Input) => {
    const user = await SendbirdCalls.authenticate(value.userId, value.accessToken);
    await AuthManager.authenticate(value);

    AppLogger.log('sendbird user:', user);
    return user;
  };

  const registerToken = async () => {
    if (Platform.OS === 'android') {
      const token = await messaging().getToken();
      await Promise.all([
        SendbirdCalls.registerPushToken(token, true),
        TokenManager.set({ value: token, type: 'fcm' }),
      ]);
    }

    if (Platform.OS === 'ios') {
      const apnsToken = await messaging().getAPNSToken();
      if (apnsToken) {
        await Promise.all([
          SendbirdCalls.registerPushToken(apnsToken, true),
          TokenManager.set({ value: apnsToken, type: 'apns' }),
        ]);
      }
    }

    AppLogger.log('registered token:', TokenManager.token);
  };

  const onSignIn = async (value: Input) => {
    const user = await authenticate(value);
    setCurrentUser(user);
    await registerToken();
  };

  return (
    <ScrollView
      contentContainerStyle={{ backgroundColor: 'white', flex: 1, paddingVertical: 12, paddingHorizontal: 16 }}
    >
      <SignInForm {...state} hideApplicationId onChange={setState} onSubmit={onSignIn} />
    </ScrollView>
  );
};

export default DirectCallSignInScreen;
