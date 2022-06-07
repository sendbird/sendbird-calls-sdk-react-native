import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image } from 'react-native';

import UserInfoHeader from '../../../shared/components/UserInfoHeader';
import Palette from '../../../shared/styles/palette';
import { DirectRoutes } from '../../navigations/routes';
import DirectCallDialScreen from './DirectCallDialScreen';
import DirectCallSettingsStack from './DirectCallSettingsStack';

const Tab = createBottomTabNavigator();

const DirectCallHomeTab = () => {
  return (
    <Tab.Navigator screenOptions={{ tabBarShowLabel: false, tabBarHideOnKeyboard: false }}>
      <Tab.Screen
        name={DirectRoutes.DIAL}
        component={DirectCallDialScreen}
        options={{
          header: UserInfoHeader,
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                source={focused ? require('../../../assets/icCallFilled.png') : require('../../../assets/icCall.png')}
                style={{ width: 24, height: 24, tintColor: focused ? Palette.background600 : Palette.background300 }}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={DirectRoutes.SETTINGS_STACK}
        component={DirectCallSettingsStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                source={
                  focused
                    ? require('../../../assets/iconSettingsFilled.png')
                    : require('../../../assets/iconSettings.png')
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

export default DirectCallHomeTab;
