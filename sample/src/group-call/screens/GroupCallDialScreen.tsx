import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { SendbirdCalls } from '@sendbird/calls-react-native';

import InputSafeView from '../../shared/components/InputSafeView';

const getCachedRoomById = (roomId) => {
  return SendbirdCalls.getCachedRoomById(roomId);
};

const fetchRoomById = (roomId) => {
  SendbirdCalls.fetchRoomById(roomId)
    .then(async (room) => {
      console.log('fetchRoomById: ', room);

      const cachedRoom = getCachedRoomById(room.roomId);
      console.log('getCachedRoomById2: ', cachedRoom);
    })
    .catch((e) => {
      console.log('fetchRoomById e: ', e);
    });
};

const createRoom = () => {
  const roomID = '124902db-3c13-4b70-8feb-0d718635461c';
  const cachedRoom = getCachedRoomById(roomID);
  console.log('getCachedRoomById: ', cachedRoom);

  fetchRoomById('124902db-3c13-4b70-8feb-0d718635461c');
  // SendbirdCalls.createRoom(SendbirdCalls.RoomType.SMALL_ROOM_FOR_VIDEO)
  //   .then(async (room) => {
  //     console.log('createRoom: ', room);

  //     const cachedRoom = getCachedRoomById(room.roomId);
  //     console.log('getCachedRoomById: ', cachedRoom);

  //     fetchRoomById(room.roomId);
  //   })
  //   .catch((e) => {
  //     console.log('createRoom e: ', e);
  //   });
};

const GroupCallDialScreen = () => {
  const [roomID, setRoomID] = useState<string>('');

  return (
    <InputSafeView>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text>Icon</Text>
          <Text style={styles.title}>Create a room</Text>
          <Text style={styles.desc}>Start a group call in a room and share the room ID with others.</Text>
          <Button title="Create" onPress={createRoom} />
        </View>

        <View style={[styles.card, { marginTop: 20 }]}>
          <Text>Icon</Text>
          <Text style={styles.title}>Enter with room ID</Text>
          <Text style={styles.desc}>Enter an existing room to participate in a group call.</Text>
          <TextInput style={styles.input} value={roomID} onChangeText={setRoomID} placeholder="Room ID" />
        </View>
      </View>
    </InputSafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontWeight: '600',
  },
  desc: {},
  input: {
    backgroundColor: '#e3e3e3',
    paddingHorizontal: 16,
  },
});

export default GroupCallDialScreen;
