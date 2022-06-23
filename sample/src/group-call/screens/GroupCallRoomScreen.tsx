import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import Loading from '../../shared/components/Loading';
import Palette from '../../shared/styles/palette';
import { AppLogger } from '../../shared/utils/logger';
import ModalRoomId from '../components/ModalRoomId';
import RoomFooter from '../components/RoomFooter';
import RoomHeader from '../components/RoomHeader';
import { useGroupCallRoom } from '../hooks/useGroupCallRoom';
import { useGroupNavigation } from '../hooks/useGroupNavigation';
import { GroupRoutes } from '../navigations/routes';

const GroupCallRoomScreen = () => {
  const {
    navigation: { goBack },
    route: {
      params: { roomId, isCreated },
    },
  } = useGroupNavigation<GroupRoutes.ROOM>();

  const [visible, setVisible] = useState(isCreated ?? false);

  const { room, isFetched } = useGroupCallRoom(roomId);
  if (!room) {
    if (isFetched) {
      AppLogger.log('[ERROR] RoomScreen getCachedRoomById');
      goBack();
    }

    return <Loading visible={true} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Palette.background500} barStyle={'light-content'} />
      <ModalRoomId roomId={roomId} visible={visible} onClose={() => setVisible(false)} />

      <RoomHeader />

      <View style={styles.view}>{/* Video View */}</View>

      <RoomFooter />
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
