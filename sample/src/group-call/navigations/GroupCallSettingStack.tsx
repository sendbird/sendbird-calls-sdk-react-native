import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import Header, { HeaderLeftTypes } from '../../shared/components/Header';
import type { GroupCallSettingStackParamList } from '../navigations/navigatorTypes';
import { GroupRoutes } from '../navigations/routes';
import GroupCallAppInfoScreen from '../screens/GroupCallAppInfoScreen';
import GroupCallSettingsScreen from '../screens/GroupCallSettingsScreen';

type SettingScreenNavigationProps = NativeStackNavigationProp<GroupCallSettingStackParamList>;
export type GroupCallSettingStackProps = {
  navigation: SettingScreenNavigationProps;
};

const Stack = createNativeStackNavigator<GroupCallSettingStackParamList>();

const GroupCallSettingStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={GroupRoutes.SETTINGS}
        component={GroupCallSettingsScreen}
        options={{ header: () => <Header title="Settings" /> }}
      />
      <Stack.Screen
        name={GroupRoutes.APP_INFO}
        component={GroupCallAppInfoScreen}
        options={{ header: () => <Header title="Application information" headerLeftType={HeaderLeftTypes.BACK} /> }}
      />
    </Stack.Navigator>
  );
};

export default GroupCallSettingStack;
