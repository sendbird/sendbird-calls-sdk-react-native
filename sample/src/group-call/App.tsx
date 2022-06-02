import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { useAuthContext } from '../shared/contexts/AuthContext';
import { GroupRoutes } from './navigations/routes';
import GroupCallHomeTab from './screens/GroupCallHomeTab';
import GroupCallSignInScreen from './screens/GroupCallSignInScreen';

const Stack = createNativeStackNavigator();

const GroupCallApp = () => {
  const { currentUser } = useAuthContext();
  return (
    <Stack.Navigator>
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
