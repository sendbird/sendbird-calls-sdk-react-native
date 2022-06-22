import React, { useState } from 'react';
import { Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Room, SendbirdCalls } from '@sendbird/calls-react-native';

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
  const { top, bottom } = useSafeAreaInsets();

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

      <View style={[styles.header, { paddingTop: top }]}>
        <Pressable
          style={styles.roomInfo}
          onPress={() => room && navigate(GroupRoutes.ROOM_INFO, { roomId, createdBy: room?.createdBy })}
        >
          <SBIcon icon="Rooms" size={19} containerStyle={styles.roomIcon} />
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
          <Pressable hitSlop={10} onPress={() => /* TODO */ console.log('Camera Flip')}>
            <SBIcon icon="CameraFlipIos" color={Palette.background50} />
          </Pressable>
        </View>
      </View>

      <View style={styles.view}>{/* Video View */}</View>

      <View style={[styles.footer, { paddingBottom: bottom }]}>
        <Pressable hitSlop={10} onPress={() => navigate(GroupRoutes.SETTINGS)}>
          <SBIcon icon={'Settings'} size={20} color={Palette.background50} />
          <SBText caption2 color={Palette.onBackgroundDark01} style={{ marginTop: 4 }}>
            {'Settings'}
          </SBText>
        </Pressable>

        <View style={styles.fotterIcons}>
          <Pressable hitSlop={10} onPress={() => /* TODO */ console.log('Audio On/Off')}>
            <SBIcon icon={room?.localParticipant.isAudioEnabled ? 'btnAudioOff' : 'btnAudioOffSelected'} size={48} />
          </Pressable>

          <Pressable
            style={{ marginHorizontal: 12 }}
            hitSlop={10}
            onPress={() => /* TODO */ console.log('Video On/Off')}
          >
            <SBIcon icon={room?.localParticipant.isVideoEnabled ? 'btnVideoOff' : 'btnVideoOffSelected'} size={48} />
          </Pressable>

          <Pressable hitSlop={10} disabled={!room} onPress={exit}>
            <SBIcon icon={'btnCallEnd'} size={48} />
          </Pressable>
        </View>

        <Pressable
          hitSlop={10}
          onPress={() => room && navigate(GroupRoutes.PARTICIPANTS, { roomId, participants: room?.participants })}
        >
          <SBIcon icon={'User'} size={20} color={Palette.background50} />
          <SBText caption2 color={Palette.onBackgroundDark01} style={{ marginTop: 4 }}>
            {'Participants'}
          </SBText>
        </Pressable>
      </View>
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
    flex: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  footer: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: Palette.background500,
  },
  fotterIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GroupCallRoomScreen;
