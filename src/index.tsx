import { Platform } from 'react-native';

import { NativeSendbirdCalls } from './libs/NativeModule';
import type { DirectCall, SendbirdCallsExternalSpec, User } from './types';

class SendbirdCallsModule implements SendbirdCallsExternalSpec {
  private static _instance: SendbirdCallsModule;
  public static get instance() {
    if (!SendbirdCallsModule._instance) SendbirdCallsModule._instance = new SendbirdCallsModule();
    return SendbirdCallsModule._instance;
  }

  private _applicationId = '';
  private _initialized = false;
  private _currentUser: User | null = null;
  private _ongoingCalls: Array<DirectCall> = [];

  public get applicationId() {
    return this._applicationId;
  }
  public get initialized() {
    return this._initialized;
  }
  public get currentUser() {
    return this._currentUser;
  }
  public get ongoingCallCount() {
    return this._ongoingCalls.length;
  }
  public get ongoingCalls() {
    return this._ongoingCalls;
  }

  protected getConstants = () => {
    return NativeSendbirdCalls.getConstants?.() ?? {};
  };

  // TODO: remove test method
  protected multiply = (a: number, b: number) => {
    return NativeSendbirdCalls.multiply(a, b);
  };

  public getCurrentUser = async () => {
    this._currentUser = await NativeSendbirdCalls.getCurrentUser();
    return this.currentUser;
  };

  public initialize = async (appId: string) => {
    this._applicationId = appId;
    this._initialized = await NativeSendbirdCalls.initialize(appId);
    return this.initialized;
  };
  public authenticate = async (userId: string, accessToken: string | null = null) => {
    this._currentUser = await NativeSendbirdCalls.authenticate(userId, accessToken);
    return this.currentUser as User;
  };
  public deauthenticate = async () => {
    await NativeSendbirdCalls.deauthenticate();
    this._currentUser = null;
  };
  public registerPushToken = async (token: string, unique = true) => {
    await NativeSendbirdCalls.registerPushToken(token, unique);
  };
  public unregisterPushToken = async (token: string) => {
    await NativeSendbirdCalls.unregisterPushToken(token);
  };
  public ios_voipRegistration = async () => {
    if (Platform.OS !== 'ios') return '';
    return NativeSendbirdCalls.voipRegistration();
  };
  public ios_registerVoIPPushToken = async (token: string, unique = true) => {
    if (Platform.OS !== 'ios') return;
    await NativeSendbirdCalls.registerVoIPPushToken(token, unique);
  };
  public ios_unregisterVoIPPushToken = async (token: string) => {
    if (Platform.OS !== 'ios') return;
    await NativeSendbirdCalls.unregisterVoIPPushToken(token);
  };

  todo = () => {
    return;
  };
}

const SendbirdCalls = SendbirdCallsModule.instance;
export default SendbirdCalls;
export * from './types';
