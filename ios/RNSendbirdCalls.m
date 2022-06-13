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

// MARK: - SendbirdCalls: Common
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
                  : (NSString *)userId
                  : (nullable NSString *)accessToken
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(deauthenticate
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(registerPushToken
                  : (NSString *)token
                  : (BOOL *)unique
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(unregisterPushToken
                  : (NSString *)token
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(registerVoIPPushToken
                  : (NSString *)token
                  : (BOOL *)unique
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(unregisterVoIPPushToken
                  : (NSString *)token
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(dial
                  : (NSString *)calleeId
                  : (BOOL *)isVideoCall
                  : (NSDictionary *)options
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

// MARK: - SendbirdCalls: DirectCall
RCT_EXTERN_METHOD(selectVideoDevice
                  : (NSString *)callId
                  : (NSDictionary *)device
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(accept
                  : (NSString *)callId
                  : (NSDictionary *)options
                  : (BOOL *)holdActiveCall
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(end
                  : (NSString *)callId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(switchCamera
                  : (NSString *)callId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startVideo
                  : (NSString *)callId)

RCT_EXTERN_METHOD(stopVideo
                  : (NSString *)callId)

RCT_EXTERN_METHOD(muteMicrophone
                  : (NSString *)callId)

RCT_EXTERN_METHOD(unmuteMicrophone
                  : (NSString *)callId)

RCT_EXTERN_METHOD(updateLocalVideoView
                  : (NSString *)callId
                  : (NSNumber *)videoViewId)

RCT_EXTERN_METHOD(updateRemmoteVideoView
                  : (NSString *)callId
                  : (NSNumber *)videoViewId)

//#ifdef RCT_NEW_ARCH_ENABLED
//- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
//    (const facebook::react::ObjCTurboModule::InitParams &)params
//{
//    return std::make_shared<facebook::react::NativeCalculatorSpecJSI>(params);
//}
//#endif
@end
