import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';

import { SendbirdCalls } from '@sendbird/calls-react-native';

import InputSafeView from '../../shared/components/InputSafeView';
import SBButton from '../../shared/components/SBButton';
import SBIcon from '../../shared/components/SBIcon';
import SBText from '../../shared/components/SBText';
import SBTextInput from '../../shared/components/SBTextInput';
import Palette from '../../shared/styles/palette';
import { AppLogger } from '../../shared/utils/logger';
import { useGroupNavigation } from '../hooks/useGroupNavigation';
import { GroupRoutes } from '../navigations/routes';

const GroupCallDialScreen = () => {
  const {
    navigation: { navigate },
  } = useGroupNavigation<GroupRoutes.DIAL>();

  const [roomId, setRoomId] = useState<string>('');
  useFocusEffect(
    useCallback(() => {
      setRoomId('');
    }, []),
  );

  const onNavigate = async (isCreated = false) => {
    if (isCreated) {
      try {
        const room = await SendbirdCalls.createRoom(SendbirdCalls.RoomType.SMALL_ROOM_FOR_VIDEO);
        AppLogger.log('DialScreen createRoom', room.roomId);
        await room.enter();
        navigate(GroupRoutes.ROOM, { roomId: room.roomId, isCreated: true });
      } catch (e) {
        AppLogger.log('[ERROR] DialScreen createRoom', e);
      }
    } else {
      Keyboard.dismiss();
      try {
        const room = await SendbirdCalls.fetchRoomById(roomId);
        AppLogger.log('DialScreen fetchRoomById', room);
        navigate(GroupRoutes.ENTER_ROOM, { roomId });
      } catch (e) {
        AppLogger.log('[ERROR] DialScreen fetchRoomById', e);
      }
    }
  };

  return (
    <InputSafeView>
      <ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>
        <View style={styles.card}>
          <SBIcon icon={'RoomAdd'} containerStyle={{ alignItems: 'flex-start' }} />
          <SBText h1 style={styles.title}>
            Create a room
          </SBText>
          <SBText body2>Start a group call in a room and share the room ID with others.</SBText>
          <SBButton style={styles.button} onPress={() => onNavigate(true)}>
            {'Create'}
          </SBButton>
        </View>

        <View style={[styles.card, { marginTop: 20 }]}>
          <SBIcon icon={'Join'} containerStyle={{ alignItems: 'flex-start' }} />
          <SBText h1 style={styles.title}>
            Enter with room ID
          </SBText>
          <SBText body2>Enter an existing room to participate in a group call.</SBText>
          <View style={styles.inputBox}>
            <SBTextInput
              value={roomId}
              onChangeText={setRoomId}
              placeholder={'Room ID'}
              placeholderTextColor={Palette.onBackgroundLight02}
              onSubmitEditing={() => onNavigate()}
              style={styles.input}
              autoCapitalize={'none'}
              autoCorrect={false}
            />
            {!!roomId && (
              <SBButton variant="text" style={styles.textButton} onPress={() => onNavigate()}>
                {'Enter'}
              </SBButton>
            )}
          </View>
        </View>
      </ScrollView>
    </InputSafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Palette.background100,
  },
  card: {
    backgroundColor: Palette.background50,
    padding: 24,
    borderRadius: 4,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
  },
  button: {
    height: 48,
    marginTop: 24,
    borderRadius: 4,
  },
  inputBox: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: Palette.background100,
  },
  textButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
});

export default GroupCallDialScreen;
