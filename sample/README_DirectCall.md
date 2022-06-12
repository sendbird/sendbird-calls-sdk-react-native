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
// ...
// ...

// MARK: - VoIP Notification - Receive token
- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)pushCredentials forType:(PKPushType)type
{
  [RNVoipPushNotificationManager didUpdatePushCredentials:pushCredentials forType:(NSString *)type];
}

// MARK: - VoIP Notification - Receive incoming push event
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type
{
  [SBCSendBirdCall pushRegistry:registry didReceiveIncomingPushWith:payload for:type completionHandler:nil];
}

// MARK: - VoIP Notification - Receive incoming call
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type withCompletionHandler:(void (^)())completion
{
  [SBCSendBirdCall pushRegistry:registry didReceiveIncomingPushWith:payload for:type completionHandler:^(NSUUID * _Nullable uuid) {
    completion();
  }];
}
```

#### Remote Notification (APNs)

implement `didReceiveRemoteNotification` to `AppDelegate.m`

```objc
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [SBCSendBirdCall application:application didReceiveRemoteNotification:userInfo];
}
```
