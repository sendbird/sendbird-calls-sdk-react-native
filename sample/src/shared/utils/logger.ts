import { Platform } from 'react-native';

import { getLogger } from '@sendbird/calls-react-native';

export const AppLogger = getLogger('info', `[SampleApp_${Platform.OS}]`);
