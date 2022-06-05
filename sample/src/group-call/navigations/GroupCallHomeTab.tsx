import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image } from 'react-native';

import UserInfoHeader from '../../shared/components/UserInfoHeader';
import Palette from '../../shared/styles/palette';
import GroupCallDialScreen from '../screens/GroupCallDialScreen';
import GroupCallSettingStack from './GroupCallSettingStack';
import { GroupRoutes } from './routes';

const Tab = createBottomTabNavigator();

const GroupCallHomeTab = () => {
  return (
    <Tab.Navigator screenOptions={{ tabBarShowLabel: false, tabBarHideOnKeyboard: true }}>
      <Tab.Screen
        name={GroupRoutes.DIAL}
        component={GroupCallDialScreen}
        options={{
          header: UserInfoHeader,
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                source={focused ? require('../../assets/iconRoomsFilled.png') : require('../../assets/iconRooms.png')}
                style={{ width: 24, height: 24, tintColor: focused ? Palette.background600 : Palette.background300 }}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={GroupRoutes.SETTING_STACK}
        component={GroupCallSettingStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                source={
                  focused ? require('../../assets/iconSettingsFilled.png') : require('../../assets/iconSettings.png')
                }
                style={{ width: 24, height: 24, tintColor: focused ? Palette.background600 : Palette.background300 }}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default GroupCallHomeTab;
