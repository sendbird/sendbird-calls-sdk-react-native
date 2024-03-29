/* eslint-disable multiline-ternary */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import Header, { HeaderLeftTypes } from '../shared/components/Header';
import { useAuthContext } from '../shared/contexts/AuthContext';
import GroupCallHomeTab from './navigations/GroupCallHomeTab';
import { GroupRoutes } from './navigations/routes';
import GroupCallAppInfoScreen from './screens/GroupCallAppInfoScreen';
import GroupCallEnterRoomScreen from './screens/GroupCallEnterRoomScreen';
import GroupCallParticipantsScreen from './screens/GroupCallParticipantsScreen';
import GroupCallRoomInfoScreen from './screens/GroupCallRoomInfoScreen';
import GroupCallRoomScreen from './screens/GroupCallRoomScreen';
import GroupCallSettingsScreen from './screens/GroupCallSettingsScreen';
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
            name={GroupRoutes.ENTER_ROOM}
            component={GroupCallEnterRoomScreen}
            options={{ header: () => <Header title="Enter room" headerLeftType={HeaderLeftTypes.CANCEL} /> }}
          />
          <Stack.Screen name={GroupRoutes.ROOM} component={GroupCallRoomScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name={GroupRoutes.ROOM_INFO}
            component={GroupCallRoomInfoScreen}
            options={{ header: () => <Header title="Room information" headerLeftType={HeaderLeftTypes.BACK} /> }}
          />
          <Stack.Screen
            name={GroupRoutes.PARTICIPANTS}
            component={GroupCallParticipantsScreen}
            options={{ header: () => <Header title="Participants" headerLeftType={HeaderLeftTypes.CANCEL} /> }}
          />
          <Stack.Screen
            name={GroupRoutes.SETTINGS}
            component={GroupCallSettingsScreen}
            options={{ header: () => <Header title="Settings" headerLeftType={HeaderLeftTypes.BACK} /> }}
          />
          <Stack.Screen
            name={GroupRoutes.APP_INFO}
            component={GroupCallAppInfoScreen}
            options={{ header: () => <Header title="Application information" headerLeftType={HeaderLeftTypes.BACK} /> }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default GroupCallApp;
