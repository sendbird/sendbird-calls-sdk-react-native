import type { NativeModule, TurboModule } from 'react-native';

import type { DirectCall } from './DirectCall';
import type { User } from './User';
import type { AsNativeInterface } from './index';

export interface TestModule {
  multiply(a: number, b: number): Promise<number>;
}

export interface CommonModule {
  applicationId: string;
  currentUser: User | null;
  ongoingCallCount: number;
  ongoingCalls: Array<DirectCall>;

  getCurrentUser(): Promise<User | null>;

  initialize(appId: string): Promise<boolean>;
  authenticate(userId: string, accessToken?: string | null): Promise<User>;
  deauthenticate(): Promise<void>;
  registerPushToken(token: string, unique?: boolean): Promise<void>;
  unregisterPushToken(token: string): Promise<void>;

  ios_voipRegistration(): Promise<string>;
  ios_registerVoIPPushToken(token: string, unique?: boolean): Promise<void>;
  ios_unregisterVoIPPushToken(token: string): Promise<void>;
}

export interface DirectCallModule {
  todo(): void;
}

export interface GroupCallModule {
  todo(): void;
}

type NativeModuleInterface = NativeModule & TurboModule;
type CallsModuleInterface = TestModule & CommonModule & DirectCallModule & GroupCallModule;

interface SendbirdCallsSpec extends NativeModuleInterface, CallsModuleInterface {}
export type SendbirdInternalSpec = AsNativeInterface<SendbirdCallsSpec>;

type InternalFields = Extract<keyof SendbirdCallsSpec, 'multiply' | keyof NativeModuleInterface>;
export type SendbirdCallsExternalSpec = Omit<SendbirdCallsSpec, InternalFields>;
