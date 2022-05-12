import { EventEmitter, NativeEventEmitter, NativeModules, Platform } from 'react-native';

import type { DirectCallProperties, SendbirdInternalSpec } from '../types';

const LINKING_ERROR =
  "The package '@sendbird/calls-react-native' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const MODULE_NAME = 'RNSendbirdCalls';
const NativeModule = NativeModules[MODULE_NAME]; //TurboModuleRegistry.get<SendbirdCallsSpec>(MODULE_NAME);
const NoopModuleProxy = new Proxy(
  {},
  {
    get() {
      throw new Error(LINKING_ERROR);
    },
  },
);

enum CallsEvent {
  DEFAULT = 'sendbird.call',
  DIRECT_CALL = 'sendbird.call.direct',
}

enum DefaultEventType {
  ON_RINGING = 'sendbird.call.onRinging',
}
enum DirectCallEventType {
  ON_ESTABLISHED = 'sendbird.call.direct.onEstablished',
  ON_CONNECTED = 'sendbird.call.direct.onConnected',
  ON_RECONNECTING = 'sendbird.call.direct.onReconnecting',
  ON_RECONNECTED = 'sendbird.call.direct.onReconnected',
  ON_ENDED = 'sendbird.call.direct.onEnded',
  ON_REMOTE_AUDIO_SETTINGS_CHANGED = 'sendbird.call.direct.onRemoteAudioSettingsChanged',
  ON_REMOTE_VIDEO_SETTINGS_CHANGED = 'sendbird.call.direct.onRemoteVideoSettingsChanged',
  ON_LOCAL_VIDEO_SETTINGS_CHANGED = 'sendbird.call.direct.onLocalVideoSettingsChanged',
  ON_REMOTE_RECORDING_STATUS_CHANGED = 'sendbird.call.direct.onRemoteRecordingStatusChanged',
  ON_AUDIO_DEVICE_CHANGED = 'sendbird.call.direct.onAudioDeviceChanged',
  ON_CUSTOM_ITEMS_UPDATED = 'sendbird.call.direct.onCustomItemsUpdated',
  ON_CUSTOM_ITEMS_DELETED = 'sendbird.call.direct.onCustomItemsDeleted',
  ON_USER_HOLD_STATUS_CHANGED = 'sendbird.call.direct.onUserHoldStatusChanged',
}

type EventUnion =
  | {
      eventType: DefaultEventType; //Values<typeof DefaultEventType>;
      data: DirectCallProperties;
    }
  | {
      eventType: DirectCallEventType; //Values<typeof DirectCallEventType>;
      data: DirectCallProperties;
    };

type ExtractData<T extends U['eventType'], U extends EventUnion = EventUnion> = U extends { eventType: T }
  ? U['data']
  : never;

export default class CallsNativeModule {
  private _nativeModule: SendbirdInternalSpec = NativeModule ?? NoopModuleProxy;
  private _nativeEmitter = new NativeEventEmitter(this._nativeModule);
  private _jsEmitter = new EventEmitter();
  private _supportedNativeEvents = [CallsEvent.DEFAULT, CallsEvent.DIRECT_CALL];

  public get nativeModule() {
    return this._nativeModule;
  }
  public get jsEmitter() {
    return this._jsEmitter;
  }

  constructor() {
    /* for reduce redundant native event listeners */
    this._supportedNativeEvents.forEach((event) => {
      // Native -> JS
      this._nativeEmitter.addListener(event, ({ eventType, data }: EventUnion) => {
        // JS -> JS
        this.jsEmitter.emit(eventType, data);
      });
    });
  }

  addListener<T extends EventUnion['eventType']>(type: T, callback: (data: ExtractData<T>) => void) {
    const subscription = this.jsEmitter.addListener(type, callback);
    return () => subscription.remove();
  }
}
