import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Room } from '@sendbird/calls-react-native';

import SBIcon from '../../shared/components/SBIcon';
import SBText from '../../shared/components/SBText';
import Palette from '../../shared/styles/palette';
import { AppLogger } from '../../shared/utils/logger';
import { useGroupNavigation } from '../hooks/useGroupNavigation';
import { GroupRoutes } from '../navigations/routes';

const RoomHeader = ({ room }: { room: Room }) => {
  const {
    navigation: { navigate },
    route: {
      params: { roomId },
    },
  } = useGroupNavigation<GroupRoutes.ROOM>();

  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Pressable
        style={styles.info}
        onPress={() => room && navigate(GroupRoutes.ROOM_INFO, { roomId, createdBy: room.createdBy })}
      >
        <SBIcon icon="Rooms" size={19} containerStyle={styles.infoIcon} />
        <SBText
          h3
          color={Palette.onBackgroundDark01}
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={{ flex: 1, marginHorizontal: 8 }}
        >
          {roomId}
        </SBText>
        <SBIcon icon="ShevronRight" color={Palette.background50} />
      </Pressable>

      <View style={styles.right}>
        <Pressable style={{ marginRight: 24 }} hitSlop={10} onPress={() => /* TODO */ console.log('Speaker')}>
          <SBIcon icon="Speaker" color={Palette.background50} />
        </Pressable>
        <Pressable
          hitSlop={10}
          onPress={async () => {
            try {
              await room.localParticipant?.switchCamera();
            } catch (e) {
              AppLogger.log('[ERROR] RoomScreen switchCamera', e);
            }
          }}
        >
          <SBIcon icon="CameraFlipIos" color={Palette.background50} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Palette.background500,
  },
  info: {
    flex: 1,
    height: 44,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Palette.background300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    width: 100,
    height: 44,
    flexDirection: 'row',
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export default RoomHeader;
