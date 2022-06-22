import type { LocalParticipantMethods, ParticipantProperties } from '../types';
import type NativeBinder from './NativeBinder';

export class LocalParticipant implements ParticipantProperties, LocalParticipantMethods {
  /** @internal **/
  public static get(binder: NativeBinder, props: ParticipantProperties | null, roomId: string) {
    if (!props) return null;

    const localParticipant = new LocalParticipant(binder, props, roomId);
    return localParticipant._updateInternal(props);
  }

  constructor(binder: NativeBinder, props: ParticipantProperties, roomId: string) {
    this._binder = binder;
    this._props = props;
    this._roomId = roomId;
  }

  private _binder: NativeBinder;
  private _props: ParticipantProperties;
  private _roomId: string;

  private _updateInternal(props: ParticipantProperties) {
    this._props = props;
    return this;
  }

  public get participantId() {
    return this._props.participantId;
  }
  public get user() {
    return this._props.user;
  }
  public get state() {
    return this._props.state;
  }
  public get enteredAt() {
    return this._props.enteredAt;
  }
  public get exitedAt() {
    return this._props.exitedAt;
  }
  public get duration() {
    return this._props.duration;
  }
  public get isAudioEnabled() {
    return this._props.isAudioEnabled;
  }
  public get isVideoEnabled() {
    return this._props.isVideoEnabled;
  }
  public get updatedAt() {
    return this._props.updatedAt;
  }

  public muteMicrophone = () => {
    this._binder.nativeModule.localMuteMicrophone(this._roomId);
    this._props.isAudioEnabled = false;
  };
  public unmuteMicrophone = () => {
    this._binder.nativeModule.localUnmuteMicrophone(this._roomId);
    this._props.isAudioEnabled = true;
  };

  public stopVideo = () => {
    this._binder.nativeModule.localStopVideo(this._roomId);
    this._props.isVideoEnabled = false;
  };
  public startVideo = () => {
    this._binder.nativeModule.localStartVideo(this._roomId);
    this._props.isVideoEnabled = true;
  };

  public switchCamera = async () => {
    return await this._binder.nativeModule.localSwitchCamera(this._roomId);
  };
}
