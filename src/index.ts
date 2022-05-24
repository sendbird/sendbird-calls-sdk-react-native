import { createVideoView } from './libs/NativeCallsComponent';
import SendbirdCallsModule from './libs/SendbirdCallsModule';

export * from './types';
export { CallsEvent, DefaultEventType, DirectCallEventType } from './libs/NativeCallsModule';

export const SendbirdCalls = new SendbirdCallsModule();
export const SendbirdCallsVideoView = createVideoView(SendbirdCalls);
