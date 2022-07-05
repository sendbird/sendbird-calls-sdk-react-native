import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AudioDeviceSelectModal } from '../../shared/components/AudioDeviceButton';
import SBIcon from '../../shared/components/SBIcon';
import SBText from '../../shared/components/SBText';
import Palette from '../../shared/styles/palette';
import { useGroupCallRoom } from '../hooks/useGroupCallRoom';
import { useGroupNavigation } from '../hooks/useGroupNavigation';
import { GroupRoutes } from '../navigations/routes';

const RoomHeader = () => {
  const {
    navigation: { navigate },
    route: {
      params: { roomId },
    },
  } = useGroupNavigation<GroupRoutes.ROOM>();

  const { top } = useSafeAreaInsets();
  const { room, flipCameraFrontAndBack } = useGroupCallRoom(roomId);

  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.container, !!top && { paddingTop: top }]}>
      <Pressable
        style={styles.info}
        onPress={() => room && navigate(GroupRoutes.ROOM_INFO, { roomId, createdBy: room.createdBy })}
      >
        <SBIcon icon="Rooms" size={19} containerStyle={styles.infoIcon} />
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
        <Pressable style={{ marginRight: 24 }} hitSlop={10} onPress={() => setVisible(true)}>
          <SBIcon icon="Speaker" color={Palette.background50} />
        </Pressable>
        <Pressable hitSlop={10} onPress={flipCameraFrontAndBack}>
          <SBIcon icon="CameraFlipIos" color={Palette.background50} />
        </Pressable>
      </View>

      {Platform.OS === 'android' && (
        <AudioDeviceSelectModal
          currentDevice={room?.android_currentAudioDevice}
          devices={room?.android_availableAudioDevices ?? []}
          visible={visible}
          onSelect={async (device) => {
            setVisible(false);
            device && (await room?.android_selectAudioDevice(device));
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Palette.background500,
  },
  info: {
    flex: 1,
    height: 44,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
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
});

export default RoomHeader;
