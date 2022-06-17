import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import { Room, SendbirdCalls } from '@sendbird/calls-react-native';

import SBButton from '../../shared/components/SBButton';
import { useLayoutEffectAsync } from '../../shared/hooks/useEffectAsync';
import Palette from '../../shared/styles/palette';
import { AppLogger } from '../../shared/utils/logger';
import { useGroupNavigation } from '../hooks/useGroupNavigation';
import { GroupRoutes } from '../navigations/routes';

const GroupCallRoomScreen = () => {
  const {
    navigation: { goBack },
    route: {
      params: { roomId },
    },
  } = useGroupNavigation<GroupRoutes.ROOM>();

  const [room, setRoom] = useState<Room>();

  useLayoutEffectAsync(async () => {
    try {
      const room = await SendbirdCalls.getCachedRoomById(roomId);
      if (room === null) throw Error(`The room(${roomId}) is not exists`);
      room.addListener({
        onRemoteParticipantEntered(participant) {
          AppLogger.log('RoomScreen onRemoteParticipantEntered', participant);
        },
        onRemoteParticipantExited(participant) {
          AppLogger.log('RoomScreen onRemoteParticipantExited', participant);
        },
      });
      setRoom(room);
    } catch (e) {
      AppLogger.log('[ERROR] RoomScreen getCachedRoomById', e);
      goBack();
    }
  }, []);

  const exit = () => {
    room?.exit();
    goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Palette.background500} barStyle={'light-content'} />

      <View>{/* top - room info, speacker, change camera */}</View>

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
    paddingHorizontal: 24,
    backgroundColor: Palette.background600,
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
