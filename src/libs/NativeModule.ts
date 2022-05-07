import { NativeModules, Platform } from 'react-native';

import type { SendbirdInternalSpec } from '../types';

const LINKING_ERROR =
  "The package '@sendbird/calls-react-native' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const MODULE_NAME = 'RNSendbirdCalls';
const NativeModule = NativeModules[MODULE_NAME] as SendbirdInternalSpec; //TurboModuleRegistry.get<SendbirdCallsSpec>(MODULE_NAME);

const NoopModuleProxy = new Proxy({} as SendbirdInternalSpec, {
  get() {
    throw new Error(LINKING_ERROR);
  },
});

export const NativeSendbirdCalls = NativeModule ?? NoopModuleProxy;
