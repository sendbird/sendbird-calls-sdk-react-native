import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SendbirdCalls } from '@sendbird/calls-react-native';

import Palette from '../../shared/styles/palette';
import Typography from '../../shared/styles/typography';

const GroupCallAppInfoScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={Typography.body2}>Name</Text>
        <Text style={[Typography.body1, { marginTop: 4 }]}>Voice & Video</Text>
      </View>

      <View style={styles.info}>
        <Text style={Typography.body2}>ID</Text>
        <Text style={[Typography.body1, { marginTop: 4 }]}>{SendbirdCalls.applicationId}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: Palette.background50,
  },
  info: {
    borderBottomWidth: 1,
    borderBottomColor: Palette.background100,
    paddingVertical: 16,
  },
  title: {
    fontWeight: '600',
  },
  desc: {},
});

export default GroupCallAppInfoScreen;
