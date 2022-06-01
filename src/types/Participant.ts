import type { User } from './User';

export interface Participant {
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

export enum ParticipantState {
  ENTERED = 'ENTERED',
  CONNECTED = 'CONNECTED',
  EXITED = 'EXITED',
}
