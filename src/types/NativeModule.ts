import type { NativeModule, TurboModule } from 'react-native';

import type { DirectCall } from '../libs/DirectCall';
import type { CallOptions, DirectCallProperties } from './Call';
import type { AudioDevice, VideoDevice } from './Media';
import type { User } from './User';
import type { AsJSInterface } from './index';

type NativeModuleInterface = NativeModule & TurboModule;

export interface NativeCommonModule {
  applicationId: string;
  currentUser: User | null;
  ongoingCallCount: number;
  ongoingCalls: Array<DirectCallProperties>;

  getCurrentUser(): Promise<User | null>;

  initialize(appId: string): boolean;
  authenticate(userId: string, accessToken?: string | null): Promise<User>;
  deauthenticate(): Promise<void>;
  registerPushToken(token: string, unique?: boolean): Promise<void>;
  unregisterPushToken(token: string): Promise<void>;

  // iOS only
  voipRegistration(): Promise<string>;
  // iOS only
  registerVoIPPushToken(token: string, unique?: boolean): Promise<void>;
  // iOS only
  unregisterVoIPPushToken(token: string): Promise<void>;
}

export interface NativeDirectCallModule {
  selectVideoDevice(callId: string, device: VideoDevice): Promise<void>;
  // Android only
  selectAudioDevice(callId: string, device: AudioDevice): Promise<void>;
  accept(callId: string, options: CallOptions, holdActiveCall: boolean): Promise<void>;
  end(callId: string): Promise<void>;
  switchCamera(callId: string): Promise<void>;
  startVideo(callId: string): void;
  stopVideo(callId: string): void;
  muteMicrophone(callId: string): void;
  unmuteMicrophone(callId: string): void;
  updateLocalVideoView(callId: string, videoViewId: number): void;
  updateRemoteVideoView(callId: string, videoViewId: number): void;

  /** Not implemented yet belows **/
  // hold(callId:string): Promise<void>;
  // unhold(callId:string, force: boolean): Promise<void>;
  //
  // captureLocalVideoView(callId:string): Promise<string>; // capture -> tmp file path
  // captureRemoteVideoView(callId:string): Promise<string>;
  // updateCustomItems(callId:string, items: Record<string, string>): Promise<CustomItemUpdateResult>;
  // deleteAllCustomItems(callId:string): Promise<void>;
  // deleteCustomItems(callId:string, key: string[]): Promise<CustomItemUpdateResult>;
  //
  // startRecording(callId:string, options: RecordingOptions): Promise<{ recordingId: string }>;
  // stopRecording(callId:string, recordingId: string): void;
  //
  // startScreenShare(callId:string): Promise<void>;
  // stopScreenShare(callId:string): Promise<void>;
}

export interface SendbirdCallsInternalSpec extends NativeModuleInterface, NativeCommonModule, NativeDirectCallModule {}

type IOSSpecificKeys = 'voipRegistration' | 'registerVoIPPushToken' | 'unregisterVoIPPushToken';
export interface SendbirdCallsExternalSpec extends AsJSInterface<NativeCommonModule, 'ios', IOSSpecificKeys> {
  getDirectCall(props: DirectCallProperties): DirectCall;
}