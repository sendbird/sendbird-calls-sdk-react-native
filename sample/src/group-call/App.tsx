/* eslint-disable multiline-ternary */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import Header, { HeaderLeftTypes } from '../shared/components/Header';
import { useAuthContext } from '../shared/contexts/AuthContext';
import GroupCallHomeTab from './navigations/GroupCallHomeTab';
import { GroupRoutes } from './navigations/routes';
import GroupCallRoomInfoScreen from './screens/GroupCallRoomInfoScreen';
import GroupCallSignInScreen from './screens/GroupCallSignInScreen';

const Stack = createNativeStackNavigator();

const GroupCallApp = () => {
  const { currentUser } = useAuthContext();
  return (
    <Stack.Navigator>
      {!currentUser ? (
        <Stack.Screen name={GroupRoutes.SIGN_IN} component={GroupCallSignInScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name={GroupRoutes.HOME_TAB} component={GroupCallHomeTab} options={{ headerShown: false }} />
          <Stack.Screen
            name={GroupRoutes.ROOM_INFO}
            component={GroupCallRoomInfoScreen}
            options={{ header: () => <Header title="Room information" headerLeftType={HeaderLeftTypes.BACK} /> }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default GroupCallApp;
