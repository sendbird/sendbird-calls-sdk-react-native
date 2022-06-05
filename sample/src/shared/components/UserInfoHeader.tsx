import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { useAuthContext } from '../contexts/AuthContext';
import Palette from '../styles/palette';
import Typography from '../styles/typography';

const UserInfoHeader = () => {
  const { currentUser } = useAuthContext();
  const { profileUrl, nickname, userId } = currentUser ?? {};

  const source = profileUrl ? { uri: profileUrl } : require('../../assets/iconAvatar.png');

  return (
    <View style={styles.container}>
      <Image source={source} style={styles.profileImg} />

      <View style={styles.info}>
        <Text style={Typography.h3}>{nickname || '-'}</Text>
        <Text style={[Typography.caption2, { paddingTop: 2 }]}>User ID: {userId}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 44,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.background50,
    borderBottomWidth: 1,
    borderBottomColor: Palette.background100,
  },
  info: {
    paddingHorizontal: 10,
  },
  profileImg: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
});

export default UserInfoHeader;
