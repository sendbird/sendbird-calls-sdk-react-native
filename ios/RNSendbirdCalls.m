//#ifdef RCT_NEW_ARCH_ENABLED
//#import "RNSendbirdCallsSpec.h"
//#endif
#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>
#import <React/RCTEventEmitter.h>


@interface RCT_EXTERN_MODULE(RNSendbirdCalls, NSObject)

// MARK: - ReactNative: RCTEventEmitter
RCT_EXTERN_METHOD(addListener
                  : (NSString *)eventName)

RCT_EXTERN_METHOD(removeListeners
                  : (double)count)

// MARK: - SendbirdCalls: Utils
RCT_EXTERN_METHOD(handleRemoteNotificationData
                  : (NSDictionary *)data)

RCT_EXTERN_METHOD(routePickerView)


// MARK: - SendbirdCalls: Queries
RCT_EXTERN_METHOD(createDirectCallLogListQuery
                  : (NSDictionary *)params
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(createRoomListQuery
                  : (NSDictionary *)params
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(queryNext
                  : (NSString *)queryKey
                  : (NSString *)type
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(queryRelease
                  : (NSString *)querKey)


// MARK: - SendbirdCalls: Common
RCT_EXTERN_METHOD(setLoggerLevel
                  : (NSString *)level)

RCT_EXTERN_METHOD(addDirectCallSound
                  : (NSString *)type
                  : (NSString *)fileName)

RCT_EXTERN_METHOD(removeDirectCallSound
                  : (NSString *)type)

RCT_EXTERN_METHOD(setDirectCallDialingSoundOnWhenSilentOrVibrateMode
                  : (nonnull NSNumber *)enabled)

RCT_EXTERN_METHOD(initialize
                  : (NSString *)appId)

RCT_EXTERN_METHOD(getCurrentUser
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getOngoingCalls
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getDirectCall
                  : (NSString *)callIdOrUUID
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(authenticate
                  : (NSDictionary *)authParams
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(deauthenticate
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(registerPushToken
                  : (NSString *)token
                  : (nonnull NSNumber *)unique
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(unregisterPushToken
                  : (NSString *)token
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(registerVoIPPushToken
                  : (NSString *)token
                  : (nonnull NSNumber *)unique
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(unregisterVoIPPushToken
                  : (NSString *)token
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(dial
                  : (NSString *)calleeId
                  : (nonnull NSNumber *)isVideoCall
                  : (NSDictionary *)options
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(fetchRoomById
                  : (NSString *)roomId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getCachedRoomById
                  : (NSString *)roomId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(createRoom
                  : (NSDictionary *)params
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

// MARK: - SendbirdCalls: DirectCall
RCT_EXTERN_METHOD(accept
                  : (NSString *)callId
                  : (NSDictionary *)options
                  : (nonnull NSNumber *)holdActiveCall
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(end
                  : (NSString *)callId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(updateLocalVideoView
                  : (NSString *)callId
                  : (nonnull NSNumber *)videoViewId)

RCT_EXTERN_METHOD(updateRemoteVideoView
                  : (NSString *)callId
                  : (nonnull NSNumber *)videoViewId)

// MARK: - SendbirdCalls: GroupCall
RCT_EXTERN_METHOD(enter
                  : (NSString *)roomId
                  : (NSDictionary *)options
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(exit
                  : (NSString *)roomId)

// MARK: - SendbirdCalls: MediaDeviceControl
RCT_EXTERN_METHOD(switchCamera
                  : (NSString *)type
                  : (NSString *)identifier
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startVideo
                  : (NSString *)type
                  : (NSString *)identifier)

RCT_EXTERN_METHOD(stopVideo
                  : (NSString *)type
                  : (NSString *)identifier)

RCT_EXTERN_METHOD(muteMicrophone
                  : (NSString *)type
                  : (NSString *)identifier)

RCT_EXTERN_METHOD(unmuteMicrophone
                  : (NSString *)type
                  : (NSString *)identifier)

RCT_EXTERN_METHOD(selectVideoDevice
                  : (NSString *)type
                  : (NSString *)identifier
                  : (NSDictionary *)device
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

//#ifdef RCT_NEW_ARCH_ENABLED
//- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
//    (const facebook::react::ObjCTurboModule::InitParams &)params
//{
//    return std::make_shared<facebook::react::NativeCalculatorSpecJSI>(params);
//}
//#endif
@end
