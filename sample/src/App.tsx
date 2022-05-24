import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { AuthProvider } from './contexts/AuthContext';
import { RootStack } from './libs/factory';
import { Routes } from './libs/routes';
import SignInScreen from './screens/SignInScreen';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Screen name={Routes.SIGN_IN} component={SignInScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
