import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import UserInfoHeader from '../../components/UserInfoHeader';
import { GroupRoutes } from '../../libs/routes';
import DialScreen from './DialScreen';
import SettingsScreen from './SettingsScreen';

const Tab = createBottomTabNavigator();

const HomeTab = () => {
  return (
    <Tab.Navigator screenOptions={{ tabBarShowLabel: false, tabBarHideOnKeyboard: true }}>
      <Tab.Screen
        name={GroupRoutes.DIAL}
        component={DialScreen}
        options={{
          header: UserInfoHeader,
        }}
      />
      <Tab.Screen name={GroupRoutes.SETTINGS} component={SettingsScreen} options={{ headerTitle: 'Settings' }} />
    </Tab.Navigator>
  );
};

export default HomeTab;
