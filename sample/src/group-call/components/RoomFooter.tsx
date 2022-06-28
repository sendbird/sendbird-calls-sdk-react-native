import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SBIcon from '../../shared/components/SBIcon';
import SBText from '../../shared/components/SBText';
import Palette from '../../shared/styles/palette';
import { useGroupCallRoom } from '../hooks/useGroupCallRoom';
import { useGroupNavigation } from '../hooks/useGroupNavigation';
import { GroupRoutes } from '../navigations/routes';

const RoomFooter = () => {
  const {
    navigation: { navigate, goBack },
    route: {
      params: { roomId },
    },
  } = useGroupNavigation<GroupRoutes.ROOM>();
  const { bottom } = useSafeAreaInsets();

  const { room, toggleLocalParticipantAudio, toggleLocalParticipantVideo } = useGroupCallRoom(roomId);

  const exit = () => {
    room?.exit();
    goBack();
  };

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <Pressable hitSlop={10} onPress={() => navigate(GroupRoutes.SETTINGS, { roomId })}>
        <SBIcon icon={'Settings'} size={20} color={Palette.background50} />
        <SBText caption2 color={Palette.onBackgroundDark01} style={{ marginTop: 4 }}>
          {'Settings'}
        </SBText>
      </Pressable>

      <View style={styles.icons}>
        <Pressable hitSlop={10} onPress={toggleLocalParticipantAudio}>
          <SBIcon icon={room?.localParticipant?.isAudioEnabled ? 'btnAudioOff' : 'btnAudioOffSelected'} size={48} />
        </Pressable>

        <Pressable style={{ marginHorizontal: 12 }} hitSlop={10} onPress={toggleLocalParticipantVideo}>
          <SBIcon icon={room?.localParticipant?.isVideoEnabled ? 'btnVideoOff' : 'btnVideoOffSelected'} size={48} />
        </Pressable>

        <Pressable hitSlop={10} disabled={!room} onPress={exit}>
          <SBIcon icon={'btnCallEnd'} size={48} />
        </Pressable>
      </View>

      <Pressable
        hitSlop={10}
        onPress={() => room && navigate(GroupRoutes.PARTICIPANTS, { roomId, participants: room.participants })}
      >
        <SBIcon icon={'User'} size={20} color={Palette.background50} />
        <SBText caption2 color={Palette.onBackgroundDark01} style={{ marginTop: 4 }}>
          {'Participants'}
        </SBText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: Palette.background500,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RoomFooter;
