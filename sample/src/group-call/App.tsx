/* eslint-disable multiline-ternary */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { useAuthContext } from '../shared/contexts/AuthContext';
import GroupCallHomeTab from './navigations/GroupCallHomeTab';
import { GroupRoutes } from './navigations/routes';
import GroupCallSignInScreen from './screens/GroupCallSignInScreen';

const Stack = createNativeStackNavigator();

const GroupCallApp = () => {
  const { currentUser } = useAuthContext();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!currentUser ? (
        <Stack.Screen name={GroupRoutes.SIGN_IN} component={GroupCallSignInScreen} />
      ) : (
        <>
          <Stack.Screen name={GroupRoutes.HOME_TAB} component={GroupCallHomeTab} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default GroupCallApp;
