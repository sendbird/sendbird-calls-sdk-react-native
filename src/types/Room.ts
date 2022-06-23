import type { AudioDevice } from './Media';
import type { NativeGroupCallModule } from './NativeModule';
import type { ParticipantProperties } from './Participant';
import type { AsJSCommonControl, AsJSGroupCall } from './index';

export interface RoomListener {
  /**
   * Called when the update properties internally on Javascript side
   *
   * @platform Javascript
   * @since 1.0.0
   */
  onPropertyUpdatedManually: (room: RoomProperties) => void;

  /** Called when the room is deleted **/
  onDeleted: () => void;

  /** Called when ... **/
  onError: (e: Error, participant?: ParticipantProperties) => void;

  /** Called when a participant is entered the room **/
  onRemoteParticipantEntered: (participant: ParticipantProperties) => void;

  /** Called when a participant is exited the room **/
  onRemoteParticipantExited: (participant: ParticipantProperties) => void;

  /** Called when ... **/
  onRemoteParticipantStreamStarted: (participant: ParticipantProperties) => void;

  /** Called when the audio device is changed **/
  onAudioDeviceChanged: (currentAudioDevice: AudioDevice | null, availableAudioDevices: AudioDevice[]) => void;

  /** Called when video settings of the remote participant are changed **/
  onRemoteVideoSettingsChanged: (participant: ParticipantProperties) => void;

  /** Called when audio settings of the remote participant are changed **/
  onRemoteAudioSettingsChanged: (participant: ParticipantProperties) => void;

  /** Called when the custom items of the call are updated. **/
  onCustomItemsUpdated: (updatedKeys: string[]) => void;

  /** Called when the custom items of the call are deleted. **/
  onCustomItemsDeleted: (deletedKeys: string[]) => void;
}

export interface RoomProperties {
  roomId: string;
  state: RoomState;
  type: RoomType;
  customItems: Record<string, string>;

  participants: ParticipantProperties[];
  localParticipant: ParticipantProperties | null;
  remoteParticipants: ParticipantProperties[];

  availableAudioDevices: AudioDevice[];
  currentAudioDevice: AudioDevice | null;

  createdAt: number;
  createdBy: string;
}

type JSGroupCallModule = AsJSGroupCall<AsJSCommonControl<NativeGroupCallModule>>; // TODO: check platform specific func

export interface GroupCallMethods extends JSGroupCallModule {
  addListener(listener: Partial<RoomListener>): () => void;
}

export enum RoomType {
  SMALL_ROOM_FOR_VIDEO = 'SMALL_ROOM_FOR_VIDEO',
  LARGE_ROOM_FOR_AUDIO_ONLY = 'LARGE_ROOM_FOR_AUDIO_ONLY',
}

export enum RoomState {
  OPEN = 'OPEN',
  DELETED = 'DELETED',
}

export type EnterParams = {
  /** @default true */
  audioEnabled?: boolean;
  /** @default true */
  videoEnabled?: boolean;
};
