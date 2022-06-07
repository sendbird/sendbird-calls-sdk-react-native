import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import SBText from '../../shared/components/SBText';
import Palette from '../../shared/styles/palette';
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
        <SBText body2>Room ID</SBText>
        <SBText body1 style={{ marginTop: 4 }}>
          {roomId}
        </SBText>
      </View>

      <View style={styles.info}>
        <SBText body2>Created by</SBText>
        <SBText body1 style={{ marginTop: 4 }}>
          User ID: {createdBy}
        </SBText>
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
});

export default GroupCallRoomInfoScreen;
