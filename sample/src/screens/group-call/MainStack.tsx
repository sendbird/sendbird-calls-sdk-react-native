import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { GroupRoutes } from '../../libs/routes';
import HomeTab from './HomeTab';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={GroupRoutes.HOME_TAB} component={HomeTab} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default MainStack;
