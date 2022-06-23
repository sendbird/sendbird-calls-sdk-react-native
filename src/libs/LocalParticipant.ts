import type { LocalParticipantMethods, ParticipantProperties, RoomListener } from '../types';
import type NativeBinder from './NativeBinder';
import { InternalEvents } from './Room';

export class LocalParticipant implements ParticipantProperties, LocalParticipantMethods {
  /** @internal **/
  public static get(
    binder: NativeBinder,
    internalEvents: InternalEvents<RoomListener>,
    props: ParticipantProperties | null,
    roomId: string,
  ) {
    if (!props) return null;

    const localParticipant = new LocalParticipant(binder, internalEvents, props, roomId);
    return localParticipant._updateInternal(props);
  }

  constructor(
    binder: NativeBinder,
    internalEvents: InternalEvents<RoomListener>,
    props: ParticipantProperties,
    roomId: string,
  ) {
    this._binder = binder;
    this._internalEvents = internalEvents;
    this._props = props;
    this._roomId = roomId;
    this._isDirectCall = false;
  }

  private _isDirectCall: boolean;
  private _binder: NativeBinder;
  private _props: ParticipantProperties;
  private _internalEvents: InternalEvents<RoomListener>;
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
    this._binder.nativeModule.muteMicrophone(this._isDirectCall, this._roomId);

    // NOTE: native doesn't have onLocalAudioSettingsChanged event
    this._props.isAudioEnabled = false;
    this._internalEvents.emit('onPropertyUpdatedManually', this);
  };
  public unmuteMicrophone = () => {
    this._binder.nativeModule.unmuteMicrophone(this._isDirectCall, this._roomId);

    // NOTE: native doesn't have onLocalAudioSettingsChanged event
    this._props.isAudioEnabled = true;
    this._internalEvents.emit('onPropertyUpdatedManually', this);
  };

  public stopVideo = () => {
    this._binder.nativeModule.stopVideo(this._isDirectCall, this._roomId);

    // NOTE: native doesn't have onLocalAudioSettingsChanged event
    this._props.isVideoEnabled = false;
    this._internalEvents.emit('onPropertyUpdatedManually', this);
  };
  public startVideo = () => {
    this._binder.nativeModule.startVideo(this._isDirectCall, this._roomId);

    // NOTE: native doesn't have onLocalAudioSettingsChanged event
    this._props.isVideoEnabled = true;
    this._internalEvents.emit('onPropertyUpdatedManually', this);
  };

  public switchCamera = async () => {
    return await this._binder.nativeModule.switchCamera(this._isDirectCall, this._roomId);
  };
}
