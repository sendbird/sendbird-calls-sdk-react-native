import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import SendbirdCalls from '@sendbird/calls-react-native';
import type { User } from '@sendbird/calls-react-native';

import { APP_ID } from './env';

export default function App() {
  const [user, setUser] = React.useState<User>();

  React.useEffect(() => {
    SendbirdCalls.initialize(APP_ID)
      .then(async () => {
        const user = await SendbirdCalls.authenticate('test-user');
        SendbirdCalls.ios_voipRegistration().then(async (token) => {
          await SendbirdCalls.registerPushToken(token, false);
          await SendbirdCalls.ios_registerVoIPPushToken(token, false);
        });

        setUser(user);
      })
      .catch((err) => {
        console.log('error', err);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {JSON.stringify(user, null, 2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
