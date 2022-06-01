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

  getCurrentUser(): Promise<User | null>;
  getOngoingCalls(): Promise<DirectCallProperties[]>;

  initialize(appId: string): boolean;
  authenticate(userId: string, accessToken?: string | null): Promise<User>;
  deauthenticate(): Promise<void>;
  registerPushToken(token: string, unique?: boolean): Promise<void>;
  unregisterPushToken(token: string): Promise<void>;
  dial(calleeUserId: string, isVideoCall: boolean, options: CallOptions): Promise<DirectCallProperties>;
  createRoom(roomType: string): Promise<void>;

  /** @platform Android **/
  handleFirebaseMessageData(data: Record<string, string>): void;

  /** @platform iOS **/
  voipRegistration(): Promise<string>;
  /** @platform iOS **/
  registerVoIPPushToken(token: string, unique?: boolean): Promise<void>;
  /** @platform iOS **/
  unregisterVoIPPushToken(token: string): Promise<void>;
}

export interface NativeDirectCallModule {
  selectVideoDevice(callId: string, device: VideoDevice): Promise<void>;

  accept(callId: string, options: CallOptions, holdActiveCall: boolean): Promise<void>;
  end(callId: string): Promise<void>;
  switchCamera(callId: string): Promise<void>;
  startVideo(callId: string): void;
  stopVideo(callId: string): void;
  muteMicrophone(callId: string): void;
  unmuteMicrophone(callId: string): void;
  updateLocalVideoView(callId: string, videoViewId: number): void;
  updateRemoteVideoView(callId: string, videoViewId: number): void;

  /** @platform Android **/
  selectAudioDevice(callId: string, device: AudioDevice): Promise<void>;

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

export interface SendbirdCallsNativeSpec extends NativeModuleInterface, NativeCommonModule, NativeDirectCallModule {}

type AndroidSpecificKeys = 'handleFirebaseMessageData';
type IOSSpecificKeys = 'voipRegistration' | 'registerVoIPPushToken' | 'unregisterVoIPPushToken';
type PlatformSpecificInterface = AsJSInterface<
  AsJSInterface<NativeCommonModule, 'ios', IOSSpecificKeys>,
  'android',
  AndroidSpecificKeys
>;
export interface SendbirdCallsJavascriptSpec extends PlatformSpecificInterface {
  getDirectCall(props: DirectCallProperties): DirectCall;
  onRinging(listener: (props: DirectCallProperties) => void): void;
}
