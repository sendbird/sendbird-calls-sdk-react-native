import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';

import { EnterParams, Room, SendbirdCalls } from '@sendbird/calls-react-native';
import { useAlert } from '@sendbird/uikit-react-native-foundation';

import IconAssets from '../../assets';
import SBButton from '../../shared/components/SBButton';
import SBIcon from '../../shared/components/SBIcon';
import SBText from '../../shared/components/SBText';
import { useAuthContext } from '../../shared/contexts/AuthContext';
import { useLayoutEffectAsync } from '../../shared/hooks/useEffectAsync';
import Palette from '../../shared/styles/palette';
import { getErrorMessage } from '../../shared/utils/error';
import { AppLogger } from '../../shared/utils/logger';
import { useGroupNavigation } from '../hooks/useGroupNavigation';
import { GroupRoutes } from '../navigations/routes';

const SCREEN_PADDING = 24;

const GroupCallEnterRoomScreen = () => {
  const { alert } = useAlert();
  const {
    navigation: { replace, goBack },
    route: {
      params: { roomId },
    },
  } = useGroupNavigation<GroupRoutes.ENTER_ROOM>();

  const [room, setRoom] = useState<Room>();
  const [enterParam, setEnterParam] = useState<EnterParams>({ audioEnabled: true, videoEnabled: true });

  const { currentUser } = useAuthContext();

  const previewWidth = useWindowDimensions().width - SCREEN_PADDING * 2;
  const previewHeight = (previewWidth * 4) / 3;

  useLayoutEffectAsync(async () => {
    try {
      const room = await SendbirdCalls.getCachedRoomById(roomId);
      if (room === null) throw Error(`The room(${roomId}) is not exists`);
      setRoom(room);
    } catch (e) {
      AppLogger.log('[GroupCallEnterRoomScreen::ERROR] getCachedRoomById - ', e);
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
      AppLogger.log('[GroupCallEnterRoomScreen::ERROR] enter - ', e);
      alert({ title: 'Enter a room', message: getErrorMessage(e) });
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.previewProfile, styles.preview, { width: previewWidth, height: previewHeight }]}>
        {enterParam.videoEnabled && <Camera style={StyleSheet.absoluteFill} cameraType={CameraType.Front} />}

        {!enterParam.videoEnabled && (
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
    paddingHorizontal: SCREEN_PADDING,
  },
  previewProfile: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: Palette.background500,
  },
  preview: {
    marginTop: SCREEN_PADDING,
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
