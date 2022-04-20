#ifdef RCT_NEW_ARCH_ENABLED
#import "RNSendbirdCallsSpec.h"
#endif
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNSendbirdCalls, NSObject)

RCT_EXTERN_METHOD(multiply:(float)a withB:(float)b
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeCalculatorSpecJSI>(params);
}
#endif

@end
