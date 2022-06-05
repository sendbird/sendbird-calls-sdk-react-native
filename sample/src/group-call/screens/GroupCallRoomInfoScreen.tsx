import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Palette from '../../shared/styles/palette';
import Typography from '../../shared/styles/typography';
import type { GroupCallRootStackParamList } from '../navigations/navigatorTypes';

type RoomInfoScreenRouteProps = RouteProp<GroupCallRootStackParamList, 'room_info'>;
type RoomInfoScreenNavigationProps = NativeStackNavigationProp<GroupCallRootStackParamList, 'room_info'>;
type Props = {
  navigation: RoomInfoScreenNavigationProps;
  route: RoomInfoScreenRouteProps;
};

const GroupCallRoomInfoScreen = ({ route: { params } }: Props) => {
  const { roomId, createdBy } = params;

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={Typography.body2}>Room ID</Text>
        <Text style={[Typography.body1, { marginTop: 4 }]}>{roomId}</Text>
      </View>

      <View style={styles.info}>
        <Text style={Typography.body2}>Created by</Text>
        <Text style={[Typography.body1, { marginTop: 4 }]}>User ID: {createdBy}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: Palette.background50,
  },
  info: {
    borderBottomWidth: 1,
    borderBottomColor: Palette.background100,
    paddingVertical: 16,
  },
  title: {
    fontWeight: '600',
  },
  desc: {},
});

export default GroupCallRoomInfoScreen;
