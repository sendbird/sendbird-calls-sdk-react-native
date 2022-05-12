import type { AudioDevice, AudioDeviceChangedInfo, RecordingStatus, VideoDevice } from './Media';
import type { User } from './User';

export interface SendbirdCallListener {
  onRinging: (call: DirectCallProperties) => void;
}

export interface DirectCallListener {
  /** Called when the callee has accepted the call, but not yet connected to media streams. **/
  onEstablished: (call: DirectCallProperties) => void;

  /** Called when media streams between the caller and callee are connected and audio/video is enabled. **/
  onConnected: (call: DirectCallProperties) => void;

  /** Called when DirectCall begins attempting to reconnect to the server after losing connection. **/
  onReconnecting: (call: DirectCallProperties) => void;

  /** Called when DirectCall successfully reconnects to the server. **/
  onReconnected: (call: DirectCallProperties) => void;

  /** Called when the call has ended. **/
  onEnded: (call: DirectCallProperties) => void;

  /** Called when the remote user changes audio settings. **/
  onRemoteAudioSettingsChanged: (call: DirectCallProperties) => void;

  /** Called when the remote user changes video settings. **/
  onRemoteVideoSettingsChanged: (call: DirectCallProperties) => void;

  /** Android only **/
  onLocalVideoSettingsChanged: (call: DirectCallProperties) => void;

  /**
   * Called when the other user’s recording status is changed.
   * You can check the recording status of the other user with `DirectCall.remoteRecordingStatus`
   * **/
  onRemoteRecordingStatusChanged: (call: DirectCallProperties) => void;

  /**
   * Called when the audio device has been changed.
   *
   * on iOS, if you want to change the audio device you should handle the native side. (Currently, only port names are supported as strings)
   * See also: AVAudioSession.setPreferredInput {@link https://developer.apple.com/documentation/avfaudio/avaudiosession/1616491-setpreferredinput}
   * See also: AVRoutePickerView {@link https://developer.apple.com/documentation/avkit/avroutepickerview}
   * **/
  onAudioDeviceChanged: (call: DirectCallProperties, info: AudioDeviceChangedInfo) => void;

  /** Called when the custom items of the call are updated. **/
  onCustomItemsUpdated: (call: DirectCallProperties, updatedKeys: string[]) => void;

  /** Called when the custom items of the call are deleted. **/
  onCustomItemsDeleted: (call: DirectCallProperties, deletedKeys: string[]) => void;

  /**
   * The local or remote user has put a call on hold or removed a hold from a call and their hold status has changed.
   * @param {DirectCall} call DirectCall that has updated user hold status
   * @param {boolean} isLocalUser Returns true if the user whose hold status changed is local user
   * @param {boolean} isUserOnHold Returns true if the user's hold status is changed to on hold
   * */
  onUserHoldStatusChanged: (call: DirectCallProperties, isLocalUser: boolean, isUserOnHold: boolean) => void;
}

export interface DirectCall extends DirectCallProperties, DirectCallMethods {}

export interface DirectCallProperties {
  callId: string;
  callLog: DirectCallLog | null;
  callee: DirectCallUser | null;
  caller: DirectCallUser | null;
  endedBy: DirectCallUser | null;
  customItems: Record<string, string>;
  duration: number;
  endResult: DirectCallEndResult;

  localUser: DirectCallUser | null;
  remoteUser: DirectCallUser | null;
  myRole: DirectCallUser | null;

  availableVideoDevices: VideoDevice[];
  currentVideoDevice: VideoDevice | null;

  android_availableAudioDevices: AudioDevice[];
  android_currentAudioDevice: AudioDevice | null;

  isEnded: boolean;
  isOnHold: boolean;
  isOngoing: boolean;
  isVideoCall: boolean;
  isLocalScreenShareEnabled: boolean;
  isLocalAudioEnabled: boolean;
  isLocalVideoEnabled: boolean;
  isRemoteAudioEnabled: boolean;
  isRemoteVideoEnabled: boolean;

  localRecordingStatus: RecordingStatus;
  remoteRecordingStatus: RecordingStatus;
}

export interface DirectCallMethods {
  selectVideoDevice(device: VideoDevice): Promise<void>;
  android_selectAudioDevice(device: AudioDevice): Promise<void>;
  accept(options: CallOptions, holdActiveCall: boolean): Promise<void>;
  end(): Promise<void>;

  switchCamera(): Promise<void>;
  startVideo(): void;
  stopVideo(): void;
  muteMicrophone(): void;
  unmuteMicrophone(): void;
  /**
   * @android setLocalVideoView
   * @ios updateLocalVideoView
   * */
  updateLocalVideoView(videoViewId: string): void;
  /**
   * @android setRemoteVideoView
   * @ios updateRemoteVideoView
   * */
  updateRemoteVideoView(videoViewId: string): void;

  setListener(listener: Partial<DirectCallListener>): void;

  /** Not implemented yet belows **/
  // hold(): Promise<void>;
  // unhold(force: boolean): Promise<void>;
  //
  // captureLocalVideoView(): Promise<string>; // capture -> tmp file path
  // captureRemoteVideoView(): Promise<string>;
  // updateCustomItems(items: Record<string, string>): Promise<CustomItemUpdateResult>;
  // deleteAllCustomItems(): Promise<void>;
  // deleteCustomItems(key: string[]): Promise<CustomItemUpdateResult>;
  //
  // startRecording(options: RecordingOptions): Promise<{ recordingId: string }>;
  // stopRecording(recordingId: string): void;
  //
  // startScreenShare(): Promise<void>;
  // stopScreenShare(): Promise<void>;
}

export interface DirectCallLog {
  startedAt: number;
  endedAt: number;
  duration: number;

  callId: string;
  isFromServer: boolean;
  isVideoCall: boolean;
  customItems: Record<string, string>;
  endResult: DirectCallEndResult;

  myRole: DirectCallUser;
  callee: DirectCallUser | null;
  caller: DirectCallUser | null;
  endedBy: DirectCallUser | null;

  android_relayProtocol: string | null;
  android_users: DirectCallUser[] | null;
  android_endedUserId: string | null;
}

export interface DirectCallUser extends User {
  role: DirectCallUserRole;
}

export enum DirectCallEndResult {
  /** Default value of the EndResult. **/
  NONE = 'NONE',

  /** The call has ended by either the caller or callee after successful connection. **/
  COMPLETED = 'COMPLETED',

  /** The caller has canceled the call before the callee accepts or declines. **/
  CANCELED = 'CANCELED',

  /** The callee has declined the call. **/
  DECLINED = 'DECLINED',

  /** The call is accepted on one of the callee’s other devices. All the other devices will receive this call result. **/
  OTHER_DEVICE_ACCEPTED = 'OTHER_DEVICE_ACCEPTED',

  /** SendBird server failed to establish a media session between the caller and callee within a specific period of time. **/
  TIMED_OUT = 'TIMED_OUT',

  /** Data streaming from either the caller or the callee has stopped due to a WebRTC connection issue while calling. **/
  CONNECTION_LOST = 'CONNECTION_LOST',

  /** The callee has not either accepted or declined the call for a specific period of time. **/
  NO_ANSWER = 'NO_ANSWER',

  /** The 'dial()' method of the call has failed. **/
  DIAL_FAILED = 'DIAL_FAILED',

  /** The 'accept()' method of the call has failed. **/
  ACCEPT_FAILED = 'ACCEPT_FAILED',

  /** Unknown **/
  UNKNOWN = 'UNKNOWN',
}

export enum DirectCallUserRole {
  CALLER = 'CALLER',
  CALLEE = 'CALLEE',
}

export type CustomItemUpdateResult = {
  updatedItems: Record<string, string>;
  affectedKeys: string[];
};

export type CallOptions = {
  localVideoViewId: string;
  remoteVideoViewId: string;

  audioEnabled: boolean;
  videoEnabled: boolean;
  frontCamera: boolean;

  android_videoFps: number;
  android_videoHeight: number;
  android_videoWidth: number;
};
