import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuthContext } from '../../shared/contexts/AuthContext';
import Palette from '../../shared/styles/palette';
import Typography from '../../shared/styles/typography';
import { GroupCallSettingStackProps } from '../navigations/GroupCallSettingStack';
import { GroupRoutes } from '../navigations/routes';

const GroupCallSettingsScreen = ({ navigation: { navigate } }: GroupCallSettingStackProps) => {
  const { currentUser, setCurrentUser } = useAuthContext();
  const { profileUrl, nickname, userId } = currentUser ?? {};

  const profileSource = profileUrl ? { uri: profileUrl } : require('../../assets/iconAvatar.png');

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image source={profileSource} style={styles.profileImg} />
        <Text style={[Typography.subtitle1, { marginTop: 8, marginBottom: 4 }]}>{nickname}</Text>
        <Text style={Typography.caption2}>User ID: {userId}</Text>
      </View>

      <View style={styles.list}>
        <Pressable style={styles.item} onPress={() => navigate(GroupRoutes.APP_INFO)}>
          <View style={styles.itemContent}>
            <Image
              source={require('../../assets/iconInfo.png')}
              style={[styles.icon, { marginRight: 16, tintColor: Palette.primary300 }]}
            />
            <Text style={Typography.subtitle2}>Application information</Text>
          </View>
          <Image
            source={require('../../assets/iconShevronRight.png')}
            style={[styles.icon, { tintColor: Palette.background600 }]}
          />
        </Pressable>

        <Pressable style={styles.item} onPress={() => setCurrentUser(null)}>
          <Image
            source={require('../../assets/iconLeave.png')}
            style={[styles.icon, { marginRight: 16, tintColor: Palette.error300 }]}
          />
          <Text style={Typography.subtitle2}>Sign out</Text>
        </Pressable>
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
  profile: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Palette.background100,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default GroupCallSettingsScreen;
