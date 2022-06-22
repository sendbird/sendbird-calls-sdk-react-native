import type { NativeModule, TurboModule } from 'react-native';

import { BridgedQuery } from '../libs/BridgedQuery';
import type { CallOptions, DirectCallLog, DirectCallProperties } from './Call';
import type { AudioDevice, VideoDevice } from './Media';
import {
  DirectCallLogQueryParams,
  NativeQueryCreator,
  NativeQueryKey,
  NativeQueryResult,
  NativeQueryType,
  RoomListQueryParams,
} from './Query';
import type { EnterParams, RoomProperties, RoomType } from './Room';
import type { User } from './User';
import type { AsJSInterface } from './index';

// --------------- Native interfaces ---------------

type NativeModuleInterface = NativeModule & TurboModule;

export type NativeConstants = {
  NATIVE_SDK_VERSION: string;
};

export interface NativeCommonModule {
  applicationId: string;
  currentUser: User | null;

  getCurrentUser(): Promise<User | null>;
  getOngoingCalls(): Promise<DirectCallProperties[]>;
  getDirectCall(callId: string): Promise<DirectCallProperties>;

  initialize(appId: string): boolean;
  authenticate(userId: string, accessToken?: string | null): Promise<User>;
  deauthenticate(): Promise<void>;
  registerPushToken(token: string, unique?: boolean): Promise<void>;
  unregisterPushToken(token: string): Promise<void>;
  // unregisterAllPushTokens(): Promise<void>;
  dial(calleeUserId: string, isVideoCall: boolean, options: CallOptions): Promise<DirectCallProperties>;
  createRoom(roomType: RoomType): Promise<RoomProperties>;
  fetchRoomById(roomId: string): Promise<RoomProperties>;
  getCachedRoomById(roomId: string): Promise<RoomProperties | null>;

  /** @platform Android **/
  handleFirebaseMessageData(data: Record<string, string>): void;

  /** @platform iOS **/
  registerVoIPPushToken(token: string, unique?: boolean): Promise<void>;
  /** @platform iOS **/
  unregisterVoIPPushToken(token: string): Promise<void>;
  /** @platform iOS **/
  routePickerView(): void;

  // addRecordingListener
  // removeRecordingListener
  // removeAllRecordingListeners
}

type CommonModule_AndroidSpecificKeys = 'handleFirebaseMessageData';
type CommonModule_IOSSpecificKeys = 'registerVoIPPushToken' | 'unregisterVoIPPushToken' | 'routePickerView';

export interface NativeDirectCallModule {
  accept(callId: string, options: CallOptions, holdActiveCall: boolean): Promise<void>;
  end(callId: string): Promise<void>;
  switchCamera(callId: string): Promise<void>;
  startVideo(callId: string): void;
  stopVideo(callId: string): void;
  muteMicrophone(callId: string): void;
  unmuteMicrophone(callId: string): void;
  updateLocalVideoView(callId: string, videoViewId: number): void;
  updateRemoteVideoView(callId: string, videoViewId: number): void;
  selectVideoDevice(callId: string, device: VideoDevice): Promise<void>;

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

export interface NativeGroupCallModule {
  enter(roomId: string, options: EnterParams): Promise<void>;
  exit(roomId: string): void;
}

export interface NativeLocalParticipantModule {
  localMuteMicrophone(roomId: string): void;
  localUnmuteMicrophone(roomId: string): void;
  localStopVideo(roomId: string): void;
  localStartVideo(roomId: string): void;
  localSwitchCamera(roomId: string): Promise<void>;
}

export interface NativeQueries {
  createDirectCallLogListQuery: NativeQueryCreator<DirectCallLogQueryParams>;
  createRoomListQuery: NativeQueryCreator<RoomListQueryParams>;
  queryNext<T extends NativeQueryType>(
    key: NativeQueryKey,
    type: T,
  ): NativeQueryResult<T extends NativeQueryType.DIRECT_CALL_LOG ? DirectCallLog : RoomProperties>;
  queryRelease(key: NativeQueryKey): void;
}

export interface SendbirdCallsNativeSpec
  extends NativeModuleInterface,
    NativeQueries,
    NativeCommonModule,
    NativeDirectCallModule,
    NativeGroupCallModule,
    NativeLocalParticipantModule {}

// --------------- Javascript interfaces ---------------

type PlatformSpecificInterface = AsJSInterface<
  AsJSInterface<NativeCommonModule, 'ios', CommonModule_IOSSpecificKeys>,
  'android',
  CommonModule_AndroidSpecificKeys
>;

export interface SendbirdCallsJavascriptSpec extends PlatformSpecificInterface {
  /** Listeners **/
  onRinging(listener: (props: DirectCallProperties) => void): void;

  /** Queries **/
  createDirectCallLogListQuery(
    params: DirectCallLogQueryParams,
  ): Promise<BridgedQuery<NativeQueryType.DIRECT_CALL_LOG>>;
  createRoomListQuery(params: RoomListQueryParams): Promise<BridgedQuery<NativeQueryType.ROOM_LIST>>;
}
