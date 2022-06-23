import React, { useReducer } from 'react';
import { Platform, ScrollView } from 'react-native';

import { SendbirdCalls } from '@sendbird/calls-react-native';

import { APP_ID } from '../../env';
import SignInForm from '../../shared/components/SignInForm';
import { useAuthContext } from '../../shared/contexts/AuthContext';
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
    userId: 'GroupCall_' + Platform.OS,
    applicationId: APP_ID,
    accessToken: '',
  });

  const onSignIn = () => {
    SendbirdCalls.authenticate(state.userId).then(async (user) => {
      AppLogger.log('sendbird user:', user);
      setCurrentUser(user);
    });
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
      <SignInForm {...state} onChange={setState} onSubmit={onSignIn} />
    </ScrollView>
  );
};

export default GroupCallSignInScreen;
