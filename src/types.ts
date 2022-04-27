import type { TurboModule } from 'react-native';

/** Module interfaces **/
export interface TestModule {
  multiply(a: number, b: number): Promise<number>;
}
export interface CommonModule {
  init(appId: string): Promise<boolean>;
  authenticate(userId: string, accessToken?: string | null): Promise<User>;
  deauthenticate(): Promise<null>;
  registerPushToken(token: string, unique?: boolean): Promise<null>;
  unregisterPushToken(token: string): Promise<null>;
}
export interface DirectCallModule {
  todo(): void;
}
export interface GroupCallModule {
  todo(): void;
}
export interface SendbirdCallsSpec extends TurboModule, TestModule, CommonModule, DirectCallModule, GroupCallModule {}

/** Model interfaces **/
interface User {
  isActive: boolean;
  userId: string;
  // TODO: check type (undefined | null)
  metaData?: Record<string, string>;
  nickname?: string;
  profileUrl?: string;
}
