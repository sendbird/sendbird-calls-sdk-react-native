import messaging from '@react-native-firebase/messaging';
import React, { useReducer } from 'react';
import { Platform, ScrollView } from 'react-native';

import { SendbirdCalls } from '@sendbird/calls-react-native';

import { APP_ID, INITIAL_ROUTE } from '../../env';
import SignInForm from '../../shared/components/SignInForm';
import { useAuthContext } from '../../shared/contexts/AuthContext';
import { AppLogger } from '../../shared/utils/logger';
import { DirectRoutes } from '../navigations/routes';

type Input = {
  applicationId: string;
  userId: string;
  accessToken?: string;
};
const DirectCallSignInScreen = () => {
  const { setCurrentUser } = useAuthContext();
  const [state, setState] = useReducer((prev: Input, next: Partial<Input>) => ({ ...prev, ...next }), {
    userId: 'DirectCall_' + Platform.OS,
    applicationId: APP_ID,
    accessToken: '',
  });

  const onSignIn = () => {
    SendbirdCalls.authenticate(state.userId).then(async (user) => {
      AppLogger.log('sendbird user:', user);

      setCurrentUser(user);

      if (INITIAL_ROUTE === DirectRoutes.DIRECT_CALL) {
        const token = Platform.OS === 'android' ? await messaging().getToken() : await messaging().getAPNSToken();
        AppLogger.log('token:', token);
        token && SendbirdCalls.registerPushToken(token, true);
      }
    });
  };

  return (
    <ScrollView
      contentContainerStyle={{ backgroundColor: 'white', flex: 1, paddingVertical: 12, paddingHorizontal: 16 }}
    >
      <SignInForm {...state} onChange={setState} onSubmit={onSignIn} />
    </ScrollView>
  );
};

export default DirectCallSignInScreen;
