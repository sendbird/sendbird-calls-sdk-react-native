/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter, NativeEventEmitter, NativeModules, Platform } from 'react-native';

import type { AsNativeInterface, DirectCallProperties, SendbirdCallsInternalSpec } from '../types';
import { convertDirectCallPropsNTJ } from '../utils/converter';

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

export enum CallsEvent {
  DEFAULT = 'sendbird.call.default',
  DIRECT_CALL = 'sendbird.call.direct',
}

export enum DefaultEventType {
  ON_RINGING = 'sendbird.call.default.onRinging',
}

export enum DirectCallEventType {
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

type MakeEventUnionMember<Type, Data> = {
  eventType: Type;
  data: AsNativeInterface<Data>;
  convertedData: Data;
  additionalData?: Record<string, any>;
};
type EventUnion =
  | MakeEventUnionMember<DefaultEventType, DirectCallProperties>
  | MakeEventUnionMember<DirectCallEventType, DirectCallProperties>;

type EventType = EventUnion['eventType'];
type ExtractData<T extends EventType, U extends EventUnion = EventUnion> = U extends { eventType: T }
  ? U['convertedData']
  : never;

export default class CallsNativeModule {
  private _nativeModule: SendbirdCallsInternalSpec = NativeModule ?? NoopModuleProxy;
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
      this._nativeEmitter.addListener(
        event,
        ({ eventType, data, additionalData }: Omit<EventUnion, 'convertedData'>) => {
          // JS -> JS
          this.jsEmitter.emit(event, {
            type: eventType,
            data: convertDirectCallPropsNTJ(data),
            additionalData,
          });
        },
      );
    });
  }

  addListener(eventName: CallsEvent.DEFAULT, callback: EventCallback<DefaultEventType>): () => void;
  addListener(eventName: CallsEvent.DIRECT_CALL, callback: EventCallback<DirectCallEventType>): () => void;
  addListener(eventName: string, callback: (event: any) => void) {
    const subscription = this.jsEmitter.addListener(eventName, callback);
    return () => subscription.remove();
  }
}

type EventCallback<T extends EventType> = (data: {
  type: T;
  data: ExtractData<T>;
  additionalData?: Record<string, any>;
}) => void;
