import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { INITIAL_ROUTE } from './env';
import { CALL_PERMISSIONS, usePermissions } from './hooks/usePermissions';
import { RootStack } from './libs/factory';
import { Routes } from './libs/routes';
import SignInScreen from './screens/SignInScreen';
import DirectCallScreen from './screens/direct-call/DirectCallScreen';
import GroupCallScreen from './screens/group-call/GroupCallScreen';

export default function App() {
  return (
    <AuthProvider>
      <Navigations />
    </AuthProvider>
  );
}

const Navigations = () => {
  const { currentUser } = useAuthContext();
  const Direct = <RootStack.Screen name={Routes.DIRECT_CALL} component={DirectCallScreen} />;
  const Group = <RootStack.Screen name={Routes.GROUP_CALL} component={GroupCallScreen} />;

  usePermissions(CALL_PERMISSIONS);

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {!currentUser ? (
          <RootStack.Screen name={Routes.SIGN_IN} component={SignInScreen} />
        ) : (
          <>
            {INITIAL_ROUTE === Routes.DIRECT_CALL ? Direct : Group}
            {INITIAL_ROUTE === Routes.DIRECT_CALL ? Group : Direct}
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
