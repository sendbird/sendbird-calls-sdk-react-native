//#ifdef RCT_NEW_ARCH_ENABLED
//#import "RNSendbirdCallsSpec.h"
//#endif
#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>
#import <React/RCTEventEmitter.h>


@interface RCT_EXTERN_MODULE(RNSendbirdCalls, NSObject)

RCT_EXTERN_METHOD(multiply
                  : (float)a
                  : (float)b
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(initialize
                  : (NSString *)appId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getCurrentUser
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

RCT_EXTERN_METHOD(voipRegistration
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

//#ifdef RCT_NEW_ARCH_ENABLED
//- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
//    (const facebook::react::ObjCTurboModule::InitParams &)params
//{
//    return std::make_shared<facebook::react::NativeCalculatorSpecJSI>(params);
//}
//#endif
@end
