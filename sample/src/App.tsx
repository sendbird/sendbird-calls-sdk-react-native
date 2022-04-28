import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import SendbirdCalls from '@sendbird/calls-react-native';

import type { User } from '../../src/types';
import { APP_ID } from './env';

export default function App() {
  const [user, setUser] = React.useState<User>();

  React.useEffect(() => {
    SendbirdCalls.init(APP_ID)
      .then(async () => {
        const user = await SendbirdCalls.authenticate('test-user');
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
