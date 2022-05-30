import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import InputSafeView from '../../components/InputSafeView';

const DialScreen = () => {
  const [roomID, setRoomID] = useState<string>('');

  return (
    <InputSafeView>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text>Icon</Text>
          <Text style={styles.title}>Create a room</Text>
          <Text style={styles.desc}>Start a group call in a room and share the room ID with others.</Text>
          <Button title="Create" onPress={() => console.log('press create btn')} />
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

export default DialScreen;
