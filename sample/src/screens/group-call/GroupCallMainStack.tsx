import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { GroupRoutes } from '../../libs/routes';
import GroupCallHomeTab from './GroupCallHomeTab';

const Stack = createNativeStackNavigator();

const GroupCallMainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={GroupRoutes.HOME_TAB} component={GroupCallHomeTab} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default GroupCallMainStack;
