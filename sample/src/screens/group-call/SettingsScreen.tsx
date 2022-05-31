import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuthContext } from '../../contexts/AuthContext';

const SettingsScreen = () => {
  const {
    currentUser: { profileUrl, nickname, userId },
  } = useAuthContext();

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Text>{profileUrl}</Text>
        <Text style={styles.nickname}>{nickname}</Text>
        <Text style={styles.userId}>User ID: {userId}</Text>
      </View>

      <View style={styles.list}>
        <Pressable style={styles.item}>
          <View style={styles.itemContent}>
            <Text style={styles.leftIcon}>Icon</Text>
            <Text style={styles.itemName}>Application information</Text>
          </View>
          <Text style={styles.rightIcon}>Right Icon</Text>
        </Pressable>
        <Pressable style={styles.item}>
          <Text style={styles.leftIcon}>Icon</Text>
          <Text style={styles.itemName}>Sign out</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profile: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  nickname: {
    fontWeight: '600',
  },
  userId: {},
  list: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
  },
  leftIcon: {
    marginRight: 10,
  },
  itemName: {
    fontWeight: '600',
  },
  rightIcon: {},
});

export default SettingsScreen;
