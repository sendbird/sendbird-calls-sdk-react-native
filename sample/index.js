/**
 * @format
 */
import { AppRegistry } from 'react-native';
import { withTouchReload } from 'react-native-touch-reload';

import { name as appName } from './app.json';
import App from './src/App';

AppRegistry.registerComponent(appName, () => withTouchReload(App));
