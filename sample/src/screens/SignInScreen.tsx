import messaging from '@react-native-firebase/messaging';
import React, { useReducer } from 'react';
import { Button, Platform, ScrollView, StyleSheet, TextInput } from 'react-native';

import { SendbirdCalls } from '@sendbird/calls-react-native';

import { useAuthContext } from '../contexts/AuthContext';
import { AppLogger } from '../libs/factory';

type Input = { id: string; nickname: string };

const SignInScreen = () => {
  const { setCurrentUser } = useAuthContext();
  const [state, setState] = useReducer((prev: Input, next: Partial<Input>) => ({ ...prev, ...next }), {
    id: 'testandroid',
    nickname: 'android',
  });

  const onSignIn = () => {
    SendbirdCalls.authenticate(state.id).then(async (user) => {
      AppLogger.log('sendbird user:', user);

      setCurrentUser(user);
      const token = Platform.OS === 'android' ? await messaging().getToken() : await messaging().getAPNSToken();
      AppLogger.log('token:', token);
      token && SendbirdCalls.registerPushToken(token, true);
    });
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1, paddingVertical: 12, paddingHorizontal: 16 }}>
      <TextInput
        value={state.id}
        onChangeText={(id) => setState({ id })}
        placeholder={'id'}
        style={[styles.input, { marginBottom: 12 }]}
      />
      <TextInput
        value={state.nickname}
        onChangeText={(nickname) => setState({ nickname })}
        placeholder={'nickname'}
        style={styles.input}
      />
      <Button title={'Sign-in'} onPress={onSignIn} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    height: 56,
    width: '100%',
    paddingHorizontal: 12,
    backgroundColor: '#e4e4e4',
    borderRadius: 4,
  },
});

export default SignInScreen;
