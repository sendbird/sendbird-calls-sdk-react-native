import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

import { EnterParams, Room, SendbirdCalls } from '@sendbird/calls-react-native';

import IconAssets from '../../assets';
import SBButton from '../../shared/components/SBButton';
import SBIcon from '../../shared/components/SBIcon';
import SBText from '../../shared/components/SBText';
import { useAuthContext } from '../../shared/contexts/AuthContext';
import { useLayoutEffectAsync } from '../../shared/hooks/useEffectAsync';
import Palette from '../../shared/styles/palette';
import { AppLogger } from '../../shared/utils/logger';
import { useGroupNavigation } from '../hooks/useGroupNavigation';
import { GroupRoutes } from '../navigations/routes';

const GroupCallEnterRoomScreen = () => {
  const {
    navigation: { replace, goBack },
    route: {
      params: { roomId },
    },
  } = useGroupNavigation<GroupRoutes.ENTER_ROOM>();

  const [room, setRoom] = useState<Room>();
  const [enterParam, setEnterParam] = useState<EnterParams>({ audioEnabled: true, videoEnabled: true });

  const devices = useCameraDevices();
  const { currentUser } = useAuthContext();

  useLayoutEffectAsync(async () => {
    try {
      const room = await SendbirdCalls.getCachedRoomById(roomId);
      if (room === null) throw Error(`The room(${roomId}) is not exists`);
      setRoom(room);
    } catch (e) {
      AppLogger.log('[ERROR] EnterRoomScreen getCachedRoomById', e);
      goBack();
    }
  }, []);

  const enterRoom = async () => {
    try {
      if (room) {
        await room.enter(enterParam);
        replace(GroupRoutes.ROOM, { roomId: room.roomId });
      }
    } catch (e) {
      AppLogger.log('[ERROR] EnterRoomScreen enter', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.previewProfile, styles.preview]}>
        {enterParam.videoEnabled && devices.front && (
          <Camera style={StyleSheet.absoluteFill} device={devices.front} isActive={true} />
        )}

        {(!enterParam.videoEnabled || !devices.front) && (
          <View style={styles.previewProfile}>
            <Image
              style={styles.profile}
              source={currentUser?.profileUrl ? { uri: currentUser.profileUrl } : IconAssets.Avatar}
            />
          </View>
        )}
      </View>

      <View style={styles.option}>
        <Pressable
          style={styles.check}
          onPress={() => setEnterParam((prev) => ({ ...prev, audioEnabled: !prev.audioEnabled }))}
        >
          <SBIcon icon={enterParam.audioEnabled ? 'CheckboxOff' : 'CheckboxOn'} />
        </Pressable>
        <SBText subtitle2>Mute my audio</SBText>
      </View>
      <View style={styles.option}>
        <Pressable
          style={styles.check}
          onPress={() => setEnterParam((prev) => ({ ...prev, videoEnabled: !prev.videoEnabled }))}
        >
          <SBIcon icon={enterParam.videoEnabled ? 'CheckboxOff' : 'CheckboxOn'} />
        </Pressable>
        <SBText subtitle2>Turn off my video</SBText>
      </View>

      <SBButton style={styles.button} disabled={!room} onPress={enterRoom}>
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
  previewProfile: {
    width: '100%',
    height: 430,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: Palette.background500,
  },
  preview: {
    marginTop: 24,
    marginBottom: 16,
  },
  profile: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
