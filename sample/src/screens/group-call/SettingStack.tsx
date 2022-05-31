import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import Header from '../../components/Header';
import { GroupSettingStackParamList } from '../../libs/navigatorTypes';
import { GroupRoutes } from '../../libs/routes';
import AppInfoScreen from './AppInfoScreen';
import SettingsScreen from './SettingsScreen';

const Stack = createNativeStackNavigator<GroupSettingStackParamList>();

const SettingStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={GroupRoutes.SETTINGS}
        component={SettingsScreen}
        options={{ header: () => <Header title="Settings" /> }}
      />
      <Stack.Screen
        name={GroupRoutes.APP_INFO}
        component={AppInfoScreen}
        options={{ header: () => <Header title="Application information" /> }}
      />
    </Stack.Navigator>
  );
};

export default SettingStack;
