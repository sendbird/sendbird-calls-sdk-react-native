import React, { useState } from 'react';
import { Pressable, StatusBar, StyleSheet, View } from 'react-native';

import { Room, SendbirdCalls } from '@sendbird/calls-react-native';

import SBButton from '../../shared/components/SBButton';
import SBIcon from '../../shared/components/SBIcon';
import SBText from '../../shared/components/SBText';
import { useLayoutEffectAsync } from '../../shared/hooks/useEffectAsync';
import Palette from '../../shared/styles/palette';
import { AppLogger } from '../../shared/utils/logger';
import { useGroupNavigation } from '../hooks/useGroupNavigation';
import { GroupRoutes } from '../navigations/routes';

const GroupCallRoomScreen = () => {
  const {
    navigation: { navigate, goBack },
    route: {
      params: { roomId },
    },
  } = useGroupNavigation<GroupRoutes.ROOM>();

  const [room, setRoom] = useState<Room>();

  useLayoutEffectAsync(async () => {
    try {
      const room = await SendbirdCalls.getCachedRoomById(roomId);
      if (room === null) throw Error(`The room(${roomId}) is not exists`);
      const unsubscribe = room.addListener({
        onRemoteParticipantEntered(participant) {
          AppLogger.log('RoomScreen onRemoteParticipantEntered', participant);
        },
        onRemoteParticipantExited(participant) {
          AppLogger.log('RoomScreen onRemoteParticipantExited', participant);
        },
      });
      setRoom(room);

      return () => unsubscribe();
    } catch (e) {
      AppLogger.log('[ERROR] RoomScreen getCachedRoomById', e);
      goBack();
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {};
    }
  }, []);

  const exit = () => {
    room?.exit();
    goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Palette.background500} barStyle={'light-content'} />

      <View style={styles.header}>
        <Pressable
          style={styles.roomInfo}
          onPress={() => room && navigate(GroupRoutes.ROOM_INFO, { roomId: room?.roomId, createdBy: room?.createdBy })}
        >
          <SBIcon icon="Rooms" size={19} containerStyle={styles.roomIcon} />
          <SBText
            h3
            color={Palette.onBackgroundDark01}
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={{ flex: 1, marginHorizontal: 8 }}
          >
            {room?.roomId}
          </SBText>
          <SBIcon icon="ShevronRight" color={Palette.background50} />
        </Pressable>

        <View style={styles.right}>
          <Pressable style={{ marginRight: 24 }} hitSlop={10} onPress={() => /* TODO */ console.log('Speaker')}>
            <SBIcon icon="Speaker" color={Palette.background50} />
          </Pressable>
          <Pressable hitSlop={10} onPress={() => /* TODO */ console.log('Camera Flip')}>
            <SBIcon icon="CameraFlipIos" color={Palette.background50} />
          </Pressable>
        </View>
      </View>

      <View style={styles.view}>{/* Video View */}</View>

      <View>{/* bottom - settings, mute, off camera, exit, participants */}</View>
      <SBButton disabled={!room} onPress={exit}>
        {'EXIT'}
      </SBButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background600,
  },
  header: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Palette.background500,
  },
  roomInfo: {
    flex: 1,
    height: 44,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomIcon: {
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
  view: {
    width: '100%',
    height: 400,
    borderRadius: 4,
    backgroundColor: Palette.background500,
    marginTop: 24,
    marginBottom: 16,
  },
});

export default GroupCallRoomScreen;
