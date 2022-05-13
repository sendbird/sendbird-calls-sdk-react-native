import SendbirdCallsModule from './SendbirdCallsModule';

const SendbirdCalls = new SendbirdCallsModule();
export default SendbirdCalls;

export { CallsEvent, DefaultEventType, DirectCallEventType } from './libs/CallsNativeModule';
export * from './types';
