import Clipboard from '@react-native-clipboard/clipboard';
import React, { FC, memo } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';

import { User } from '@sendbird/calls-react-native';

import IconAssets from '../../assets';
import SBIcon from '../../shared/components/SBIcon';
import SBText from '../../shared/components/SBText';
import Palette from '../../shared/styles/palette';
import { useGroupNavigation } from '../hooks/useGroupNavigation';
import { GroupRoutes } from '../navigations/routes';

const GroupCallParticipantsScreen = () => {
  const {
    route: {
      params: { participants, roomId },
    },
  } = useGroupNavigation<GroupRoutes.PARTICIPANTS>();

  return (
    <FlatList
      keyExtractor={({ participantId }) => participantId}
      data={participants}
      renderItem={({ item }) => <UserInfo user={item.user} />}
      ListFooterComponent={<Footer roomId={roomId} />}
    />
  );
};

export default GroupCallParticipantsScreen;

const UserInfo: FC<{ user: User }> = memo(({ user: { profileUrl, nickname, userId } }) => {
  const source = profileUrl ? { uri: profileUrl } : IconAssets.Avatar;

  return (
    <View style={styles.container}>
      <Image source={source} style={styles.profileImg} />

      <View style={styles.info}>
        <SBText h3>{nickname || '-'}</SBText>
        <SBText caption2 style={{ paddingTop: 2 }}>
          User ID: {userId}
        </SBText>
      </View>
    </View>
  );
});

const Footer = ({ roomId }: { roomId: string }) => {
  return (
    <Pressable onPress={() => Clipboard.setString(roomId)} style={styles.container}>
      <View style={styles.profileImg}>
        <SBIcon icon="Copy" />
      </View>

      <View style={styles.info}>
        <SBText subtitle2>Share room ID</SBText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 16,
    backgroundColor: Palette.background50,
  },
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Palette.background100,
  },
});
