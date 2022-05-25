import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { getLogger } from '@sendbird/calls-react-native';

export const RootStack = createNativeStackNavigator();

export const AppLogger = getLogger('debug', '[SampleApp]');
