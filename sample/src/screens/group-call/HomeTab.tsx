import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import UserInfoHeader from '../../components/UserInfoHeader';
import { GroupRoutes } from '../../libs/routes';
import DialScreen from './DialScreen';
import SettingStack from './SettingStack';

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
      <Tab.Screen
        name={GroupRoutes.SETTING_STACK}
        component={SettingStack}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeTab;
