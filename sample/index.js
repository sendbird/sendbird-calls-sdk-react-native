import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { AppRegistry, LogBox, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { withTouchReload } from 'react-native-touch-reload';

import { SendbirdCalls } from '@sendbird/calls-react-native';
import {
  DialogProvider,
  LightUIKitTheme,
  ToastProvider,
  UIKitThemeProvider,
} from '@sendbird/uikit-react-native-foundation';

import { name as appName } from './app.json';
import DirectCallApp from './src/direct-call/App';
import { APP_ID, INITIAL_ROUTE } from './src/env';
import GroupCallApp from './src/group-call/App';
import { AuthProvider } from './src/shared/contexts/AuthContext';
import { CALL_PERMISSIONS, usePermissions } from './src/shared/hooks/usePermissions';
import { navigationRef } from './src/shared/libs/StaticNavigation';
import Palette from './src/shared/styles/palette';

LogBox.ignoreLogs(['Sending `RNCallKeepDidChangeAudioRoute` with no listeners registered.']);

SendbirdCalls.Logger.setLogLevel('info');
SendbirdCalls.initialize(APP_ID);

const isGroupCall = INITIAL_ROUTE === 'group-call';
const InitialApp = isGroupCall ? GroupCallApp : DirectCallApp;

function App() {
  usePermissions(CALL_PERMISSIONS);

  return (
    <StyleProviders>
      <AuthProvider>
        <NavigationContainer
          ref={navigationRef}
          theme={{
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              background: Palette.background50,
            },
          }}
        >
          <StatusBar backgroundColor={'#FFFFFF'} barStyle={'dark-content'} />
          <InitialApp />
        </NavigationContainer>
      </AuthProvider>
    </StyleProviders>
  );
}

const StyleProviders = ({ children }) => {
  return (
    <SafeAreaProvider>
      <UIKitThemeProvider theme={LightUIKitTheme}>
        <DialogProvider>
          <ToastProvider>{children}</ToastProvider>
        </DialogProvider>
      </UIKitThemeProvider>
    </SafeAreaProvider>
  );
};

AppRegistry.registerComponent(appName, () => withTouchReload(App));
