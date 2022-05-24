import React, { useReducer } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { SendbirdCalls } from '@sendbird/calls-react-native';

import { APP_ID } from '../env';

type Input = { id: string; nickname: string };

SendbirdCalls.initialize(APP_ID);
const SignInScreen = () => {
  React.useEffect(() => {
    // SendbirdCalls.initialize(APP_ID)
    //   .then(async () => {
    //     const user = await SendbirdCalls.authenticate('test-user');
    //     SendbirdCalls.ios_voipRegistration().then((token) => SendbirdCalls.ios_registerVoIPPushToken(token, false));
    //
    //     setUser(user);
    //   })
    //   .catch((err) => {
    //     console.log('error', err);
    //   });
  }, []);

  const [state, setState] = useReducer((prev: Input, next: Partial<Input>) => ({ ...prev, ...next }), {
    id: '',
    nickname: '',
  });
  return (
    <View style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 16 }}>
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
    </View>
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
