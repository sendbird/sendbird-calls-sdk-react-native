import type { User } from './User';

export interface ParticipantProperties {
  participantId: string;
  user: User;
  state: ParticipantState;

  enteredAt: number;
  exitedAt: number;
  duration: number;

  isAudioEnabled: boolean;
  isVideoEnabled: boolean;

  updatedAt: number;
}

export interface LocalParticipantMethods {
  muteMicrophone(): void;
  unmuteMicrophone(): void;
  stopVideo(): void;
  startVideo(): void;
  switchCamera(): Promise<void>;
}

export enum ParticipantState {
  ENTERED = 'ENTERED',
  CONNECTED = 'CONNECTED',
  EXITED = 'EXITED',
}
