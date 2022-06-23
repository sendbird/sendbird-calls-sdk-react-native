import type { User } from './User';
import { AsJSCommonControl, NativeCommonUserInteractModule } from './index';

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

type JSLocalParticipantModule = AsJSCommonControl<NativeCommonUserInteractModule>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LocalParticipantMethods extends JSLocalParticipantModule {}

export enum ParticipantState {
  ENTERED = 'ENTERED',
  CONNECTED = 'CONNECTED',
  EXITED = 'EXITED',
}
