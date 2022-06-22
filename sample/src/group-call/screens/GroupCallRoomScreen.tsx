import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import { Room, SendbirdCalls } from '@sendbird/calls-react-native';

import Loading from '../../shared/components/Loading';
import { useLayoutEffectAsync } from '../../shared/hooks/useEffectAsync';
import Palette from '../../shared/styles/palette';
import { AppLogger } from '../../shared/utils/logger';
import ModalRoomId from '../components/ModalRoomId';
import RoomFooter from '../components/RoomFooter';
import RoomHeader from '../components/RoomHeader';
import { useGroupNavigation } from '../hooks/useGroupNavigation';
import { GroupRoutes } from '../navigations/routes';

const GroupCallRoomScreen = () => {
  const {
    navigation: { goBack },
    route: {
      params: { roomId, isCreated },
    },
  } = useGroupNavigation<GroupRoutes.ROOM>();

  const [room, setRoom] = useState<Room>();
  const [visible, setVisible] = useState(isCreated ?? false);

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

  if (!room) {
    return <Loading visible={true} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Palette.background500} barStyle={'light-content'} />
      <ModalRoomId roomId={roomId} visible={visible} onClose={() => setVisible(false)} />

      <RoomHeader room={room} />

      <View style={styles.view}>{/* Video View */}</View>

      <RoomFooter room={room} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background600,
  },
  view: {
    flex: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
});

export default GroupCallRoomScreen;
