import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import Palette from '../../shared/styles/palette';
import { AppLogger } from '../../shared/utils/logger';
// import GroupCallVideoStreamView from '../components/GroupCallVideoStreamView';
import ModalRoomId from '../components/ModalRoomId';
import RoomFooter from '../components/RoomFooter';
import RoomHeader from '../components/RoomHeader';
import { useGroupCallRoom } from '../hooks/useGroupCallRoom';
import { useGroupNavigation } from '../hooks/useGroupNavigation';
import { GroupRoutes } from '../navigations/routes';

const GroupCallRoomScreen = () => {
  const {
    navigation,
    route: {
      params: { roomId, isCreated },
    },
  } = useGroupNavigation<GroupRoutes.ROOM>();

  const [visible, setVisible] = useState(isCreated ?? false);
  const [, setLayoutSize] = useState({ width: 0, height: 0 });

  const { room, isFetched } = useGroupCallRoom(roomId);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      AppLogger.log('RoomScreen(beforeRemove) getCachedRoomById');
      if (room) room.exit();
    });

    return () => unsubscribe();
  }, [room]);

  useEffect(() => {
    if (isFetched && !room) {
      AppLogger.log('[ERROR] RoomScreen getCachedRoomById');
      navigation.goBack();
    }
  }, [isFetched]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Palette.background500} barStyle={'light-content'} />
      <ModalRoomId roomId={roomId} visible={visible} onClose={() => setVisible(false)} />

      <RoomHeader />

      <View
        style={styles.videoView}
        onLayout={({
          nativeEvent: {
            layout: { width, height },
          },
        }) => setLayoutSize({ width, height })}
      >
        {/* <GroupCallVideoStreamView room={room} layoutSize={layoutSize} /> */}
      </View>

      <RoomFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background600,
  },
  videoView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.background600,
  },
});

export default GroupCallRoomScreen;
