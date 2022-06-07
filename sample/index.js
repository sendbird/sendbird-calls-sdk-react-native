import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { AppRegistry, StatusBar } from 'react-native';
import { withTouchReload } from 'react-native-touch-reload';

import { SendbirdCalls } from '@sendbird/calls-react-native';

import { name as appName } from './app.json';
import DirectCallApp from './src/direct-call/App';
import { APP_ID, INITIAL_ROUTE } from './src/env';
import GroupCallApp from './src/group-call/App';
import { AuthProvider } from './src/shared/contexts/AuthContext';
import { CALL_PERMISSIONS, usePermissions } from './src/shared/hooks/usePermissions';

SendbirdCalls.Logger.setLogLevel('debug');
SendbirdCalls.initialize(APP_ID);

const isGroupCall = INITIAL_ROUTE === 'group-call';
const InitialApp = isGroupCall ? GroupCallApp : DirectCallApp;

function App() {
  usePermissions(CALL_PERMISSIONS);

  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar backgroundColor={'#FFFFFF'} barStyle={'dark-content'} />
        <InitialApp />
      </NavigationContainer>
    </AuthProvider>
  );
}

AppRegistry.registerComponent(appName, () => withTouchReload(App));
