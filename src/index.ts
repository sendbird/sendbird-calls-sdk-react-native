import NativeBinder from './libs/NativeBinder';
import SendbirdCallsModule from './libs/SendbirdCallsModule';
import { createVideoView } from './libs/VideoView';

export * from './utils/logger';
export * from './types';
export { CallsEvent, DefaultEventType, DirectCallEventType } from './libs/NativeBinder';
export { DirectCall } from './libs/DirectCall';

const nativeBinder = new NativeBinder();
export const SendbirdCalls = new SendbirdCallsModule(nativeBinder);
export const SendbirdCallsVideoView = createVideoView(SendbirdCalls, nativeBinder);
