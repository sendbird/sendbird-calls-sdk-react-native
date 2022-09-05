import React, { useReducer } from 'react';
import { Platform, ScrollView } from 'react-native';

import { SendbirdCalls } from '@sendbird/calls-react-native';

import { APP_ID } from '../../env';
import SignInForm from '../../shared/components/SignInForm';
import { useAuthContext } from '../../shared/contexts/AuthContext';
import { useLayoutEffectAsync } from '../../shared/hooks/useEffectAsync';
import AuthManager from '../../shared/libs/AuthManager';
import Palette from '../../shared/styles/palette';
import { AppLogger } from '../../shared/utils/logger';

type Input = {
  applicationId: string;
  userId: string;
  accessToken?: string;
};
const GroupCallSignInScreen = () => {
  const { setCurrentUser } = useAuthContext();
  const [state, setState] = useReducer((prev: Input, next: Partial<Input>) => ({ ...prev, ...next }), {
    userId: __DEV__ ? 'GroupCall_' + Platform.OS : '',
    applicationId: APP_ID,
    accessToken: '',
  });

  useLayoutEffectAsync(async () => {
    const credential = await AuthManager.getSavedCredential();
    if (credential) onSignIn(credential);
  }, []);

  const authenticate = async (value: Input) => {
    const user = await SendbirdCalls.authenticate(value);
    await AuthManager.authenticate(value);

    AppLogger.info('sendbird user:', user);
    return user;
  };

  const onSignIn = async (value: Input) => {
    const user = await authenticate(value);
    setCurrentUser(user);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: Palette.background50,
      }}
      keyboardShouldPersistTaps={'always'}
    >
      <SignInForm {...state} hideApplicationId onChange={setState} onSubmit={onSignIn} />
    </ScrollView>
  );
};

export default GroupCallSignInScreen;
