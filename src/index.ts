import NativeBinder from './libs/NativeBinder';
import SendbirdCallsModule from './libs/SendbirdCallsModule';

export * from './utils/logger';
export * from './types';
export { CallsEvent, DefaultEventType, DirectCallEventType } from './libs/NativeBinder';
export { DirectCall } from './libs/DirectCall';

const nativeBinder = new NativeBinder();
export const SendbirdCalls = new SendbirdCallsModule(nativeBinder);
export { default as DirectCallVideoView } from './libs/DirectCallVideoView';
