import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import UserInfoHeader from '../../components/UserInfoHeader';
import { GroupRoutes } from '../../libs/routes';
import GroupCallDialScreen from './GroupCallDialScreen';
import GroupCallSettingStack from './GroupCallSettingStack';

const Tab = createBottomTabNavigator();

const GroupCallHomeTab = () => {
  return (
    <Tab.Navigator screenOptions={{ tabBarShowLabel: false, tabBarHideOnKeyboard: true }}>
      <Tab.Screen
        name={GroupRoutes.DIAL}
        component={GroupCallDialScreen}
        options={{
          header: UserInfoHeader,
        }}
      />
      <Tab.Screen
        name={GroupRoutes.SETTING_STACK}
        component={GroupCallSettingStack}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default GroupCallHomeTab;
