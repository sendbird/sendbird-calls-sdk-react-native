import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { EnterParams, Room, SendbirdCalls } from '@sendbird/calls-react-native';

import SBButton from '../../shared/components/SBButton';
import SBIcon from '../../shared/components/SBIcon';
import SBText from '../../shared/components/SBText';
import { useLayoutEffectAsync } from '../../shared/hooks/useEffectAsync';
import Palette from '../../shared/styles/palette';
import { AppLogger } from '../../shared/utils/logger';
import { useGroupNavigation } from '../hooks/useGroupNavigation';
import { GroupRoutes } from '../navigations/routes';

const GroupCallEnterRoomScreen = () => {
  const {
    navigation: { /*navigate,*/ goBack },
    route: {
      params: { roomId },
    },
  } = useGroupNavigation<GroupRoutes.ENTER_ROOM>();

  const [room, setRoom] = useState<Room>();
  const [enterParam, setEnterParam] = useState<EnterParams>({ audioEnabled: false, videoEnabled: false });

  useLayoutEffectAsync(async () => {
    try {
      const room = await SendbirdCalls.getCachedRoomById(roomId);
      AppLogger.log('getCachedRoomById', room);
      if (room === null) throw Error(`The room(${roomId}) is not exists`);
      setRoom(room);
    } catch (e) {
      AppLogger.log('[ERROR::getCachedRoomById]', e);
      goBack();
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.view}>{/* Video View */}</View>

      <View style={styles.option}>
        <Pressable
          style={styles.check}
          onPress={() => setEnterParam((prev) => ({ ...prev, audioEnabled: !prev.audioEnabled }))}
        >
          <SBIcon icon={enterParam.audioEnabled ? 'CheckboxOn' : 'CheckboxOff'} />
        </Pressable>
        <SBText subtitle2>Mute my audio</SBText>
      </View>
      <View style={styles.option}>
        <Pressable
          style={styles.check}
          onPress={() => setEnterParam((prev) => ({ ...prev, videoEnabled: !prev.videoEnabled }))}
        >
          <SBIcon icon={enterParam.videoEnabled ? 'CheckboxOn' : 'CheckboxOff'} />
        </Pressable>
        <SBText subtitle2>Turn off my video</SBText>
      </View>

      <SBButton style={styles.button} disabled={!room} onPress={() => room?.enter(enterParam)}>
        {'Enter'}
      </SBButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  view: {
    width: '100%',
    height: 400,
    borderRadius: 4,
    backgroundColor: Palette.background500,
    marginTop: 24,
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  check: {
    marginRight: 8,
  },
  button: {
    height: 48,
    marginTop: 10,
  },
});

export default GroupCallEnterRoomScreen;
