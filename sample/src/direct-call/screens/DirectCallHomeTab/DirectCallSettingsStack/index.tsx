import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import Header, { HeaderLeftTypes } from '../../../../shared/components/Header';
import { DirectRoutes } from '../../../navigations/routes';
import DirectCallAppInfoScreen from './DirectCallAppInfoScreen';
import DirectCallSettingsScreen from './DirectCallSettingsScreen';

const Stack = createNativeStackNavigator();

const GroupCallSettingStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={DirectRoutes.SETTINGS}
        component={DirectCallSettingsScreen}
        options={{ header: () => <Header title="Settings" /> }}
      />
      <Stack.Screen
        name={DirectRoutes.APP_INFO}
        component={DirectCallAppInfoScreen}
        options={{ header: () => <Header title="Application information" headerLeftType={HeaderLeftTypes.BACK} /> }}
      />
    </Stack.Navigator>
  );
};

export default GroupCallSettingStack;
