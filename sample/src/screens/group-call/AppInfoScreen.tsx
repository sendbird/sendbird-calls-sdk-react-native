import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SendbirdCalls } from '@sendbird/calls-react-native';

const AppInfoScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title}>Name</Text>
        <Text style={styles.desc}>Voice & Video</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>ID</Text>
        <Text style={styles.desc}>{SendbirdCalls.applicationId}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  info: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  title: {
    fontWeight: '600',
  },
  desc: {},
});

export default AppInfoScreen;
