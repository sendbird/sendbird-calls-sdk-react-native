import type { TurboModule } from 'react-native';

import type { DirectCall } from './type.call';
import type { User } from './type.user';

/** Module interfaces **/
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
}
export interface DirectCallModule {
  todo(): void;
}
export interface GroupCallModule {
  todo(): void;
}

export interface SendbirdCallsSpec extends TurboModule, TestModule, CommonModule, DirectCallModule, GroupCallModule {}
type InternalFields = Extract<keyof SendbirdCallsSpec, 'getConstants' | 'multiply'>;
export type SendbirdCallsExternalSpec = Omit<SendbirdCallsSpec, InternalFields>;
