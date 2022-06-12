import { Platform } from 'react-native';

import type {
  AudioDevice,
  CallOptions,
  DirectCallEndResult,
  DirectCallListener,
  DirectCallLog,
  DirectCallMethods,
  DirectCallProperties,
  DirectCallUser,
  RecordingStatus,
  VideoDevice,
} from '../types';
import { DirectCallUserRole, RouteChangeReason } from '../types';
import { noopDirectCallListener } from '../utils';
import { Logger } from '../utils/logger';
import type NativeBinder from './NativeBinder';
import { CallsEvent, DirectCallEventType } from './NativeBinder';

export class DirectCall implements DirectCallProperties, DirectCallMethods {
  private static pool: Record<string, DirectCall> = {};
  public static get(binder: NativeBinder, props: DirectCallProperties) {
    if (!DirectCall.pool[props.callId]) DirectCall.pool[props.callId] = new DirectCall(binder, props);
    const directCall = DirectCall.pool[props.callId];
    return directCall._updateInternal(props);
  }

  constructor(private binder: NativeBinder, props: DirectCallProperties) {
    this._android_availableAudioDevices = props.android_availableAudioDevices;
    this._android_currentAudioDevice = props.android_currentAudioDevice;
    this._availableVideoDevices = props.availableVideoDevices;
    this._callId = props.callId;
    this._callLog = props.callLog;
    this._callee = props.callee;
    this._caller = props.caller;
    this._currentVideoDevice = props.currentVideoDevice;
    this._customItems = props.customItems;
    this._duration = props.duration;
    this._endResult = props.endResult;
    this._endedBy = props.endedBy;
    this._isEnded = props.isEnded;
    this._isLocalAudioEnabled = props.isLocalAudioEnabled;
    this._isLocalScreenShareEnabled = props.isLocalScreenShareEnabled;
    this._isLocalVideoEnabled = props.isLocalVideoEnabled;
    this._isOnHold = props.isOnHold;
    this._isOngoing = props.isOngoing;
    this._isRemoteAudioEnabled = props.isRemoteAudioEnabled;
    this._isRemoteVideoEnabled = props.isRemoteVideoEnabled;
    this._isVideoCall = props.isVideoCall;
    this._localRecordingStatus = props.localRecordingStatus;
    this._localUser = props.localUser;
    this._myRole = props.myRole;
    this._remoteRecordingStatus = props.remoteRecordingStatus;
    this._remoteUser = props.remoteUser;
  }

  private _android_availableAudioDevices: AudioDevice[];
  private _android_currentAudioDevice: AudioDevice | null;
  private _availableVideoDevices: VideoDevice[];
  private _callId: string;
  private _callLog: DirectCallLog | null;
  private _callee: DirectCallUser | null;
  private _caller: DirectCallUser | null;
  private _currentVideoDevice: VideoDevice | null;
  private _customItems: Record<string, string>;
  private _duration: number;
  private _endResult: DirectCallEndResult;
  private _endedBy: DirectCallUser | null;
  private _isEnded: boolean;
  private _isLocalAudioEnabled: boolean;
  private _isLocalScreenShareEnabled: boolean;
  private _isLocalVideoEnabled: boolean;
  private _isOnHold: boolean;
  private _isOngoing: boolean;
  private _isRemoteAudioEnabled: boolean;
  private _isRemoteVideoEnabled: boolean;
  private _isVideoCall: boolean;
  private _localRecordingStatus: RecordingStatus;
  private _localUser: DirectCallUser | null;
  private _myRole: DirectCallUserRole | null;
  private _remoteRecordingStatus: RecordingStatus;
  private _remoteUser: DirectCallUser | null;

  private _updateInternal(props: DirectCallProperties) {
    this._android_availableAudioDevices = props.android_availableAudioDevices;
    this._android_currentAudioDevice = props.android_currentAudioDevice;
    this._availableVideoDevices = props.availableVideoDevices;
    this._callId = props.callId;
    this._callLog = props.callLog;
    this._callee = props.callee;
    this._caller = props.caller;
    this._currentVideoDevice = props.currentVideoDevice;
    this._customItems = props.customItems;
    this._duration = props.duration;
    this._endResult = props.endResult;
    this._endedBy = props.endedBy;
    this._isEnded = props.isEnded;
    this._isLocalAudioEnabled = props.isLocalAudioEnabled;
    this._isLocalScreenShareEnabled = props.isLocalScreenShareEnabled;
    this._isLocalVideoEnabled = props.isLocalVideoEnabled;
    this._isOnHold = props.isOnHold;
    this._isOngoing = props.isOngoing;
    this._isRemoteAudioEnabled = props.isRemoteAudioEnabled;
    this._isRemoteVideoEnabled = props.isRemoteVideoEnabled;
    this._isVideoCall = props.isVideoCall;
    this._localRecordingStatus = props.localRecordingStatus;
    this._localUser = props.localUser;
    this._myRole = props.myRole;
    this._remoteRecordingStatus = props.remoteRecordingStatus;
    this._remoteUser = props.remoteUser;
    return this;
  }

  public get android_availableAudioDevices() {
    return this._android_availableAudioDevices;
  }
  public get android_currentAudioDevice() {
    return this._android_currentAudioDevice;
  }
  public get availableVideoDevices() {
    return this._availableVideoDevices;
  }
  public get callId() {
    return this._callId;
  }
  public get callLog() {
    return this._callLog;
  }
  public get callee() {
    return this._callee;
  }
  public get caller() {
    return this._caller;
  }
  public get currentVideoDevice() {
    return this._currentVideoDevice;
  }
  public get customItems() {
    return this._customItems;
  }
  public get duration() {
    return this._duration;
  }
  public get endedBy() {
    return this._endedBy;
  }
  public get isEnded() {
    return this._isEnded;
  }
  public get isLocalAudioEnabled() {
    return this._isLocalAudioEnabled;
  }
  public get isLocalScreenShareEnabled() {
    return this._isLocalScreenShareEnabled;
  }
  public get isLocalVideoEnabled() {
    return this._isLocalVideoEnabled;
  }
  public get isOnHold() {
    return this._isOnHold;
  }
  public get isOngoing() {
    return this._isOngoing;
  }
  public get isRemoteAudioEnabled() {
    return this._isRemoteAudioEnabled;
  }
  public get isRemoteVideoEnabled() {
    return this._isRemoteVideoEnabled;
  }
  public get isVideoCall() {
    return this._isVideoCall;
  }
  public get localRecordingStatus() {
    return this._localRecordingStatus;
  }
  public get localUser() {
    return this._localUser;
  }
  public get myRole() {
    return this._myRole;
  }
  public get remoteRecordingStatus() {
    return this._remoteRecordingStatus;
  }
  public get remoteUser() {
    return this._remoteUser;
  }
  public get endResult() {
    return this._endResult;
  }

  private _listener: DirectCallListener = noopDirectCallListener;
  public addListener = (listener: Partial<DirectCallListener>) => {
    Logger.debug('[DirectCall]', 'setListener', this.callId);
    this._listener = { ...noopDirectCallListener, ...listener };
    return this.binder.addListener(CallsEvent.DIRECT_CALL, ({ type, data, additionalData }) => {
      if (data.callId === this.callId) {
        this._updateInternal(data);
        switch (type) {
          case DirectCallEventType.ON_ESTABLISHED: {
            this._listener.onEstablished(data);
            break;
          }
          case DirectCallEventType.ON_CONNECTED: {
            this._listener.onConnected(data);
            break;
          }
          case DirectCallEventType.ON_RECONNECTING: {
            this._listener.onReconnecting(data);
            break;
          }
          case DirectCallEventType.ON_RECONNECTED: {
            this._listener.onReconnected(data);
            break;
          }
          case DirectCallEventType.ON_ENDED: {
            this._listener.onEnded(data);
            break;
          }
          case DirectCallEventType.ON_REMOTE_AUDIO_SETTINGS_CHANGED: {
            this._listener.onRemoteAudioSettingsChanged(data);
            break;
          }
          case DirectCallEventType.ON_REMOTE_VIDEO_SETTINGS_CHANGED: {
            this._listener.onRemoteVideoSettingsChanged(data);
            break;
          }
          case DirectCallEventType.ON_LOCAL_VIDEO_SETTINGS_CHANGED: {
            this._listener.onLocalVideoSettingsChanged(data);
            break;
          }
          case DirectCallEventType.ON_REMOTE_RECORDING_STATUS_CHANGED: {
            this._listener.onRemoteRecordingStatusChanged(data);
            break;
          }
          case DirectCallEventType.ON_CUSTOM_ITEMS_UPDATED: {
            this._listener.onCustomItemsUpdated(data, additionalData?.updatedKeys ?? []);
            break;
          }
          case DirectCallEventType.ON_CUSTOM_ITEMS_DELETED: {
            this._listener.onCustomItemsDeleted(data, additionalData?.deletedKeys ?? []);
            break;
          }
          case DirectCallEventType.ON_USER_HOLD_STATUS_CHANGED: {
            this._listener.onUserHoldStatusChanged(
              data,
              additionalData?.isLocalUser ?? false,
              additionalData?.isUserOnHold ?? false,
            );
            break;
          }
          case DirectCallEventType.ON_AUDIO_DEVICE_CHANGED: {
            if (Platform.OS === 'android') {
              this._listener.onAudioDeviceChanged(data, {
                platform: 'android',
                data: {
                  currentAudioDevice: additionalData?.currentAudioDevice ?? null,
                  availableAudioDevices: additionalData?.availableAudioDevices ?? [],
                },
              });
            }
            if (Platform.OS === 'ios') {
              this._listener.onAudioDeviceChanged(data, {
                platform: 'ios',
                data: {
                  reason: additionalData?.reason ?? RouteChangeReason.unknown,
                  currentRoute: additionalData?.currentRoute ?? { inputs: [], outputs: [] },
                  previousRoute: additionalData?.previousRoute ?? { inputs: [], outputs: [] },
                },
              });
            }
            break;
          }
        }
      }
    });
  };

  public accept = async (
    options: CallOptions = { audioEnabled: true, frontCamera: true, videoEnabled: true },
    holdActiveCall = false,
  ) => {
    await this.binder.nativeModule.accept(this.callId, options, holdActiveCall);
  };
  public end = async () => {
    await this.binder.nativeModule.end(this.callId);
  };
  public selectVideoDevice = async (device: VideoDevice) => {
    await this.binder.nativeModule.selectVideoDevice(this.callId, device);
  };
  public android_selectAudioDevice = async (device: AudioDevice) => {
    await this.binder.nativeModule.selectAudioDevice(this.callId, device);
  };
  public muteMicrophone = () => {
    this.binder.nativeModule.muteMicrophone(this.callId);
    // NOTE: native doesn't have onLocalAudioSettingsChanged event
    this._isLocalAudioEnabled = false;
    this._listener.onPropertyUpdatedManually(this);
  };
  public unmuteMicrophone = () => {
    this.binder.nativeModule.unmuteMicrophone(this.callId);
    // NOTE: native doesn't have onLocalAudioSettingsChanged event
    this._isLocalAudioEnabled = true;
    this._listener.onPropertyUpdatedManually(this);
  };
  public startVideo = () => {
    this.binder.nativeModule.startVideo(this.callId);
    // NOTE: ios native doesn't have onLocalAudioSettingsChanged event
    this._isLocalVideoEnabled = true;
    this._listener.onPropertyUpdatedManually(this);
    Platform.OS === 'ios' && this._listener.onLocalVideoSettingsChanged(this);
  };
  public stopVideo = () => {
    this.binder.nativeModule.stopVideo(this.callId);
    // NOTE: ios native doesn't have onLocalAudioSettingsChanged event
    this._isLocalVideoEnabled = false;
    Platform.OS === 'ios' && this._listener.onLocalVideoSettingsChanged(this);
  };
  public switchCamera = async () => {
    await this.binder.nativeModule.switchCamera(this.callId);
  };
  public updateLocalVideoView = (videoViewId: number) => {
    this.binder.nativeModule.updateLocalVideoView(this.callId, videoViewId);
  };
  public updateRemoteVideoView = (videoViewId: number) => {
    this.binder.nativeModule.updateRemoteVideoView(this.callId, videoViewId);
  };
}
