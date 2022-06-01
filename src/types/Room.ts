import type { AudioDevice } from './Media';
import type { Participant } from './Participant';

export interface RoomProperties {
  roomId: string;
  state: RoomState;
  type: RoomType;
  customItems: Record<string, string>;

  participants: Participant[];
  localParticipant: Participant;
  remoteParticipants: Participant[];

  android_availableAudioDevices: AudioDevice[];
  android_currentAudioDevice: AudioDevice | null;

  createdAt: number;
  createdBy: number;
}

export enum RoomType {
  SMALL_ROOM_FOR_VIDEO = 'SMALL_ROOM_FOR_VIDEO',
  LARGE_ROOM_FOR_AUDIO_ONLY = 'LARGE_ROOM_FOR_AUDIO_ONLY',
}

export enum RoomState {
  OPEN = 'OPEN',
  DELETED = 'DELETED',
}
