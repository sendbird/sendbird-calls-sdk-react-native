import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import SBButton from '../../shared/components/SBButton';
import SBIcon from '../../shared/components/SBIcon';
import SBText from '../../shared/components/SBText';
import Palette from '../../shared/styles/palette';

interface IModalRoomIdProps {
  roomId: string;
  visible: boolean;
  onClose: Function;
}

const ModalRoomId = ({ roomId, visible, onClose }: IModalRoomIdProps) => {
  return (
    <Modal
      visible={visible}
      style={StyleSheet.absoluteFill}
      transparent
      animationType={'fade'}
      onRequestClose={() => onClose()}
    >
      <View style={styles.background}>
        <View style={styles.container}>
          <SBText h3 style={{ paddingTop: 20 }}>
            Room created!
          </SBText>
          <SBText body3 style={{ paddingVertical: 8, paddingHorizontal: 20, color: Palette.onBackgroundLight02 }}>
            Share the room ID for others to enter this room for group calls.
          </SBText>

          <View style={styles.idBox}>
            <SBText body2 style={{ color: Palette.onBackgroundLight02 }}>
              Room ID
            </SBText>

            <View style={styles.copyBox}>
              <SBText body1 ellipsizeMode={'tail'} numberOfLines={1} style={{ width: '100%' }}>
                {roomId}
              </SBText>
              <Pressable style={{ marginLeft: 16 }} onPress={() => Clipboard.setString(roomId)}>
                <SBIcon icon={'Copy'} size={24} />
              </Pressable>
            </View>
          </View>

          <View style={styles.HR}>
            <SBText>test</SBText>
          </View>

          <SBButton variant={'text'} onPress={() => onClose()} style={{ marginVertical: 6 }}>
            {'OK'}
          </SBButton>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.overlay02,
    paddingHorizontal: 52,
  },
  container: {
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: Palette.background50,
  },
  idBox: {
    backgroundColor: Palette.background100,
    borderRadius: 4,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
  },
  copyBox: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 4,
  },
  HR: {
    alignSelf: 'stretch',
    height: 1,
    backgroundColor: Palette.onBackgroundLight04,
    marginVertical: 8,
  },
});

export default ModalRoomId;
