import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Room, SendbirdCalls } from '@sendbird/calls-react-native';

import InputSafeView from '../../shared/components/InputSafeView';
import SBButton from '../../shared/components/SBButton';
import SBIcon from '../../shared/components/SBIcon';
import SBText from '../../shared/components/SBText';
import SBTextInput from '../../shared/components/SBTextInput';
import Palette from '../../shared/styles/palette';
import { AppLogger } from '../../shared/utils/logger';

const enterRoom = async (roomId: string, withoutCache = false) => {
  try {
    console.log(roomId, withoutCache);
    const room: Room | null = withoutCache
      ? await SendbirdCalls.fetchRoomById(roomId) // TODO: check - maybe error
      : await SendbirdCalls.getCachedRoomById(roomId);
    AppLogger.log('enterRoom', room);
    // if (room === null) throw 'There is no Room';
    // room.enter();
  } catch (e) {
    AppLogger.log('enterRoom - e', e);
  }
};

const createRoom = async () => {
  try {
    const room: Room = await SendbirdCalls.createRoom(SendbirdCalls.RoomType.SMALL_ROOM_FOR_VIDEO);
    AppLogger.log('createRoom', room);
    enterRoom(room.roomId);
  } catch (e) {
    AppLogger.log('createRoom - e', e);
  }
};

const GroupCallDialScreen = () => {
  const [roomId, setRoomId] = useState<string>('');

  return (
    <InputSafeView>
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <SBIcon icon={'RoomAdd'} containerStyle={{ alignItems: 'flex-start' }} />
          <SBText h1 style={styles.title}>
            Create a room
          </SBText>
          <SBText body2>Start a group call in a room and share the room ID with others.</SBText>
          <SBButton style={styles.button} onPress={createRoom}>
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
              onSubmitEditing={() => enterRoom(roomId, true)}
              style={styles.input}
              autoCapitalize={'none'}
              autoCorrect={false}
            />
            {!!roomId && (
              <SBButton style={styles.textButton} onPress={() => enterRoom(roomId, true)} variant="text">
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
