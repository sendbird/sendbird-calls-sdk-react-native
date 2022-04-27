import { NativeModules, Platform } from 'react-native';

import type { SendbirdCallsSpec } from './types';

const LINKING_ERROR =
  "The package '@sendbird/calls-react-native' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const MODULE_NAME = 'RNSendbirdCalls';
const NativeModule = NativeModules[MODULE_NAME] as SendbirdCallsSpec; //TurboModuleRegistry.get<SendbirdCallsSpec>(MODULE_NAME);

const NoopModuleProxy = new Proxy({} as SendbirdCallsSpec, {
  get() {
    throw new Error(LINKING_ERROR);
  },
});

const NativeSendbirdCalls = NativeModule ?? NoopModuleProxy;
const SendbirdCalls: Omit<SendbirdCallsSpec, 'getConstants'> = {
  // getConstants: NativeSendbirdCalls.getConstants,
  multiply(a, b) {
    return NativeSendbirdCalls.multiply(a, b);
  },
  init(appId: string) {
    return NativeSendbirdCalls.init(appId);
  },
  authenticate(userId, accessToken = null) {
    return NativeSendbirdCalls.authenticate(userId, accessToken);
  },
  deauthenticate() {
    return NativeSendbirdCalls.deauthenticate();
  },
  registerPushToken(token, unique = true) {
    return NativeSendbirdCalls.registerPushToken(token, unique);
  },
  unregisterPushToken(token) {
    return NativeSendbirdCalls.unregisterPushToken(token);
  },
  todo() {
    return;
  },
};

export default SendbirdCalls;
