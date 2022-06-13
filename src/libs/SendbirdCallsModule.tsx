import { Platform } from 'react-native';

import pkg from '../../package.json';
import type { CallOptions, DirectCallProperties, SendbirdCallsJavascriptSpec, User } from '../types';
import { RoomType } from '../types';
import { noop } from '../utils';
import { Logger } from '../utils/logger';
import { DirectCall } from './DirectCall';
import NativeBinder, { CallsEvent, DefaultEventType } from './NativeBinder';
import { Room } from './Room';

export default class SendbirdCallsModule implements SendbirdCallsJavascriptSpec {
  public SDK_VERSION = pkg.version;
  public Logger = Logger;

  private _applicationId = '';
  private _initialized = false;
  private _currentUser: User | null = null;
  private _onRinging: (props: DirectCallProperties) => void = noop;

  public get applicationId() {
    return this._applicationId;
  }
  public get initialized() {
    return this._initialized;
  }
  public get currentUser() {
    return this._currentUser;
  }

  public get RoomType() {
    return RoomType;
  }

  constructor(private binder: NativeBinder) {}

  protected getConstants = () => {
    return this.binder.nativeModule.getConstants?.() ?? {};
  };

  /** Common **/
  public getCurrentUser = async () => {
    this._currentUser = await this.binder.nativeModule.getCurrentUser();
    return this.currentUser;
  };
  public getOngoingCalls(): Promise<DirectCallProperties[]> {
    return this.binder.nativeModule.getOngoingCalls();
  }
  public getDirectCall = async (callId: string): Promise<DirectCall> => {
    const callProps = await this.binder.nativeModule.getDirectCall(callId);
    return DirectCall.get(this.binder, callProps);
  };
  public initialize = (appId: string) => {
    if (this.initialized) return this.initialized;
    this.Logger.debug('[SendbirdCalls]', 'initialize()');

    this.binder.addListener(CallsEvent.DEFAULT, ({ type, data }) => {
      if (type === DefaultEventType.ON_RINGING) {
        this.Logger.debug('[SendbirdCalls]', 'onRinging', data.callId);
        this._onRinging(data);
      }
    });

    this.binder.nativeModule.initialize(appId);
    this._applicationId = appId;
    this._initialized = true;
    return this.initialized;
  };
  public authenticate = async (userId: string, accessToken: string | null = null) => {
    this._currentUser = await this.binder.nativeModule.authenticate(userId, accessToken);
    return this.currentUser as User;
  };
  public deauthenticate = async () => {
    await this.binder.nativeModule.deauthenticate();
    this._currentUser = null;
  };
  public registerPushToken = async (token: string, unique = true) => {
    await this.binder.nativeModule.registerPushToken(token, unique);
  };
  public unregisterPushToken = async (token: string) => {
    await this.binder.nativeModule.unregisterPushToken(token);
  };
  public dial(
    calleeUserId: string,
    isVideoCall: boolean,
    options: CallOptions = { audioEnabled: true, frontCamera: true, videoEnabled: true },
  ): Promise<DirectCallProperties> {
    return this.binder.nativeModule.dial(calleeUserId, isVideoCall, options);
  }
  public createRoom(roomType: RoomType): Promise<Room> {
    return this.binder.nativeModule.createRoom(roomType).then((props) => new Room(this.binder, props));
  }
  public fetchRoomById(roomId: string): Promise<Room> {
    return this.binder.nativeModule.fetchRoomById(roomId).then((props) => new Room(this.binder, props));
  }
  public getCachedRoomById(roomId: string): Promise<Room | null> {
    return this.binder.nativeModule
      .getCachedRoomById(roomId)
      .then((props) => (props ? new Room(this.binder, props) : null));
  }

  /** Platform iOS **/
  public ios_registerVoIPPushToken = async (token: string, unique = true) => {
    if (Platform.OS !== 'ios') return;
    await this.binder.nativeModule.registerVoIPPushToken(token, unique);
  };
  public ios_unregisterVoIPPushToken = async (token: string) => {
    if (Platform.OS !== 'ios') return;
    await this.binder.nativeModule.unregisterVoIPPushToken(token);
  };
  public ios_routePickerView = () => {
    if (Platform.OS !== 'ios') return;
    this.binder.nativeModule.routePickerView();
  };

  /** Platform Android **/
  public android_handleFirebaseMessageData = (data?: Record<string, string>) => {
    if (Platform.OS !== 'android' || !data?.['sendbird_call']) {
      return false;
    } else {
      this.binder.nativeModule.handleFirebaseMessageData(data);
      return true;
    }
  };

  /** Additional **/
  public onRinging(listener: (props: DirectCallProperties) => void) {
    this._onRinging = listener;
  }
}
