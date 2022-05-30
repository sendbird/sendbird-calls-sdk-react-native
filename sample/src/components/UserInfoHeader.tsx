import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { useAuthContext } from '../contexts/AuthContext';

const UserInfoHeader = () => {
  const {
    currentUser: { profileUrl, nickname, userId },
  } = useAuthContext();

  return (
    <View style={styles.container}>
      {/* <Image source={{ uri: profileUrl }} style={styles.profileImg} /> */}
      <Text>{profileUrl}</Text>

      <View style={styles.info}>
        <Text style={styles.nickname}>{nickname || '-'}</Text>
        <Text style={styles.userId}>{userId}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  info: {
    paddingHorizontal: 10,
  },
  profileImg: {
    backgroundColor: '#e3e3e3',
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  nickname: {
    fontWeight: '600',
  },
  userId: {},
});

export default UserInfoHeader;
