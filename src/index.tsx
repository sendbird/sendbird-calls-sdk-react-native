import type { TurboModule } from 'react-native';
import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  "The package '@sendbird/calls-react-native' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const MODULE_NAME = 'RNSendbirdCalls';
interface SendbirdCallsSpec extends TurboModule {
  multiply(a: number, b: number): Promise<number>;
}

const NativeCalls = NativeModules[MODULE_NAME]; //TurboModuleRegistry.get<SendbirdCallsSpec>(MODULE_NAME);
const NoopProxy = new Proxy({} as SendbirdCallsSpec, {
  get() {
    throw new Error(LINKING_ERROR);
  },
});

const RNSendbirdCalls = NativeCalls ?? NoopProxy;

export function multiply(a: number, b: number): Promise<number> {
  return RNSendbirdCalls.multiply(a, b);
}
