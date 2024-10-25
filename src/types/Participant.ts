import type { User } from './User';
import type { AsJSInterface, JSMediaDeviceControl } from './index';

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

type JSLocalParticipantMediaDeviceControl = Pick<
  JSMediaDeviceControl,
  'muteMicrophone' | 'unmuteMicrophone' | 'switchCamera' | 'startVideo' | 'stopVideo' | 'resumeVideoCapturer'
>;

export type LocalParticipantMethods = AsJSInterface<
  JSLocalParticipantMediaDeviceControl,
  'android',
  'resumeVideoCapturer'
>;

export enum ParticipantState {
  ENTERED = 'ENTERED',
  CONNECTED = 'CONNECTED',
  EXITED = 'EXITED',
}
