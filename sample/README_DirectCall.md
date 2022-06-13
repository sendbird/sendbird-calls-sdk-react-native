### Installation

### iOS

import headers to `AppDelegate.m` (or `AppDelegate.mm`)

```objc
#import <CoreMedia/CoreMedia.h>
#import <WebRTC/WebRTC.h>
#import <PushKit/PushKit.h>
#import <AVKit/AVKit.h>
#import <SendBirdCalls/SendBirdCalls-Swift.h>
```

#### VoIP Notification

Before starts, you should install native modules for using [`CallKit`](https://developer.apple.com/documentation/callkit) and [`PushKit`](https://developer.apple.com/documentation/pushkit).<br/>
At this moment, we are using [`react-native-voip-push-notification`](https://github.com/react-native-webrtc/react-native-voip-push-notification) and [`react-native-callkeep`](https://github.com/react-native-webrtc/react-native-callkeep)

implement `PKPushRegistryDelegate` to `AppDelegate.h`

```objc
#import <PushKit/PushKit.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, PKPushRegistryDelegate>
```

implement Delegate methods to `AppDelegate.m`

```objc
#import <RNVoipPushNotificationManager.h>
#import <RNCallKeep.h>
// ...
// ...

// MARK: - VoIP Notification - Receive token
- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)pushCredentials forType:(PKPushType)type
{
  [RNVoipPushNotificationManager didUpdatePushCredentials:pushCredentials forType:(NSString *)type];
}

// MARK: - VoIP Notification - Receive token
- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)pushCredentials forType:(PKPushType)type
{
  [RNVoipPushNotificationManager didUpdatePushCredentials:pushCredentials forType:(NSString *)type];
}

// MARK: - VoIP Notification - Receive incoming call
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type withCompletionHandler:(void (^)())completion
{
  // WARN: If you don't report to CallKit, the app will be shut down.
  [SBCSendBirdCall pushRegistry:registry didReceiveIncomingPushWith:payload for:type completionHandler:^(NSUUID * _Nullable uuid) {
    if(uuid != nil) {
      // Report valid call
      SBCDirectCall* call = [SBCSendBirdCall callForUUID: uuid];
      [RNCallKeep reportNewIncomingCall: [uuid UUIDString]
                                 handle: [[call remoteUser] userId]
                             handleType: @"generic"
                               hasVideo: [call isVideoCall]
                    localizedCallerName: [[call remoteUser] nickname]
                        supportsHolding: YES
                           supportsDTMF: YES
                       supportsGrouping: YES
                     supportsUngrouping: YES
                            fromPushKit: YES
                                payload: [payload dictionaryPayload]
                  withCompletionHandler: completion];
    } else {
      // Report and end invalid call
      NSUUID* uuid = [NSUUID alloc];
      NSString* uuidString = [uuid UUIDString];
      
      [RNCallKeep reportNewIncomingCall: uuidString
                                 handle: @"invalid"
                             handleType: @"generic"
                               hasVideo: NO
                    localizedCallerName: @"invalid"
                        supportsHolding: NO
                           supportsDTMF: NO
                       supportsGrouping: NO
                     supportsUngrouping: NO
                            fromPushKit: YES
                                payload: [payload dictionaryPayload]
                  withCompletionHandler: completion];
      [RNCallKeep endCallWithUUID:uuidString reason:1];
    }
  }];
}
```

> `didReceiveIncomingPushWithPayload` is being called after voip registration, 
> so you can register voip on the JS side, after set `SendbirdCalls.onRinging` and `RNCallKeep.addListener`
 
> 0. voip notification wake your app
> 1. [Native] App is start
> 2. [JS] JS bridge created and your React-Native app is mounted
> 3. [JS] call SendbirdCalls.initialize()
> 4. [JS] set SendbirdCalls.onRinging
> 5. [JS] set RNCallKeep.addListener
> 6. [JS] RNVoipPushNotification.registerVoipToken() >> it means register voip
> 7. [Native] didReceiveIncomingPushWithPayload called
> 8. [Native] SendbirdCalls.didReceiveIncomingPush >> it will trigger Ringing event
> 9. [Native] report to CallKit
> 10. [JS] onRinging listener called

#### Remote Notification (APNs)

implement `didReceiveRemoteNotification` to `AppDelegate.m`

```objc
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [SBCSendBirdCall application:application didReceiveRemoteNotification:userInfo];
}
```
