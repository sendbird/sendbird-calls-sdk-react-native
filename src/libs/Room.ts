import type {
  AudioDevice,
  EnterParams,
  GroupCallMethods,
  Participant,
  RoomProperties,
  RoomState,
  RoomType,
} from '../types';
import { Logger } from '../utils/logger';
import type NativeBinder from './NativeBinder';

export class Room implements RoomProperties, GroupCallMethods {
  constructor(private binder: NativeBinder, props: RoomProperties) {
    this._roomId = props.roomId;
    this._state = props.state;
    this._type = props.type;
    this._customItems = props.customItems;
    this._participants = props.participants;
    this._localParticipant = props.localParticipant;
    this._remoteParticipants = props.remoteParticipants;
    this._availableAudioDevices = props.availableAudioDevices;
    this._currentAudioDevice = props.currentAudioDevice;
    this._createdAt = props.createdAt;
    this._createdBy = props.createdBy;
  }

  private _roomId: string;
  private _state: RoomState;
  private _type: RoomType;
  private _customItems: Record<string, string>;
  private _participants: Participant[];
  private _localParticipant: Participant;
  private _remoteParticipants: Participant[];
  private _availableAudioDevices: AudioDevice[];
  private _currentAudioDevice: AudioDevice | null;
  private _createdAt: number;
  private _createdBy: number;

  public get roomId() {
    return this._roomId;
  }
  public get state() {
    return this._state;
  }
  public get type() {
    return this._type;
  }
  public get customItems() {
    return this._customItems;
  }
  public get participants() {
    return this._participants;
  }
  public get localParticipant() {
    return this._localParticipant;
  }
  public get remoteParticipants() {
    return this._remoteParticipants;
  }
  public get availableAudioDevices() {
    return this._availableAudioDevices;
  }
  public get currentAudioDevice() {
    return this._currentAudioDevice;
  }
  public get createdAt() {
    return this._createdAt;
  }
  public get createdBy() {
    return this._createdBy;
  }

  public removeAllEventListeners = () => {
    Logger.debug('[Room]', 'removeAllEventListeners');
  };

  public enter = async (options: EnterParams = { audioEnabled: true, videoEnabled: true }) => {
    return await this.binder.nativeModule.enter(this.roomId, options);
  };
  public exit() {
    this.binder.nativeModule.exit(this.roomId);
  }
}
