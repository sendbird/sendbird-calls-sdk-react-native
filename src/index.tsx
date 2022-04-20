import type { TurboModule } from 'react-native';
import { Platform, TurboModuleRegistry } from 'react-native';

const LINKING_ERROR =
  "The package '@sendbird/calls-react-native' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): Promise<number>;
}

const NativeCalls = TurboModuleRegistry.get<Spec>('RNSendbirdCalls');
const NoopProxy = new Proxy({} as Spec, {
  get() {
    throw new Error(LINKING_ERROR);
  },
});
const RNSendbirdCalls = NativeCalls ?? NoopProxy;

export function multiply(a: number, b: number): Promise<number> {
  return RNSendbirdCalls.multiply(a, b);
}
