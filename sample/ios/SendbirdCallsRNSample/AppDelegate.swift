import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import PushKit
import FirebaseCore
import SendBirdCalls
import RNVoipPushNotification
import RNCallKeep
import sendbird_calls_react_native

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    FirebaseApp.configure()

    // Configure Broadcast Extension for screen sharing
    RNSBScreenSharingServiceConfig.appGroupIdentifier = "group.com.sendbird.calls.reactnative.sample.app"
    RNSBScreenSharingServiceConfig.extensionBundleIdentifier = "com.sendbird.calls.reactnative.sample.app.BroadcastExtension"

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "SendbirdCallsRNSample",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}

// MARK: - VoIP Notification
extension AppDelegate: PKPushRegistryDelegate {
  // MARK: - VoIP Notification - Receive token
  func pushRegistry(_ registry: PKPushRegistry, didUpdate pushCredentials: PKPushCredentials, for type: PKPushType) {
    RNVoipPushNotificationManager.didUpdate(pushCredentials, forType: type.rawValue)
  }

  // MARK: - VoIP Notification - Receive incoming call
  /// This being called after voip registration
  /// so you can register voip on the JS side, after set `SendbirdCall.setListener` and `RNCallKeep.addListener`
  ///
  /// 0. voip notification wake your app
  /// 1. [Native] App started
  /// 2. [JS] JS bridge created and your React-Native app is mounted
  /// 3. [JS] call SendbirdCalls.initialize()
  /// 4. [JS] set SendbirdCalls.setListener({onRinging})
  /// 5. [JS] set RNCallKeep.addListener
  /// 6. [JS] RNVoipPushNotification.registerVoipToken() >> it means register voip
  /// 7. [Native] didReceiveIncomingPushWithPayload called
  /// 8-1. [Native] SendbirdCalls.didReceiveIncomingPush >> it will trigger Ringing event
  /// 8-2. [Native] report to CallKit
  /// 9. [JS] onRinging listener called
  func pushRegistry(_ registry: PKPushRegistry, didReceiveIncomingPushWith payload: PKPushPayload, for type: PKPushType, completion: @escaping () -> Void) {
    // WARN: If you don't report to CallKit, the app will be shut down.
    SendBirdCall.pushRegistry(registry, didReceiveIncomingPushWith: payload, for: type) { uuid in
      if let uuid = uuid {
        // Report valid call
        let call = SendBirdCall.getCall(forUUID: uuid)
        RNCallKeep.reportNewIncomingCall(
          uuid.uuidString,
          handle: call?.remoteUser?.userId ?? "",
          handleType: "generic",
          hasVideo: call?.isVideoCall ?? false,
          localizedCallerName: call?.remoteUser?.nickname ?? "",
          supportsHolding: true,
          supportsDTMF: true,
          supportsGrouping: true,
          supportsUngrouping: true,
          fromPushKit: true,
          payload: payload.dictionaryPayload,
          withCompletionHandler: completion
        )
      } else {
        // Report and end invalid call
        let uuid = UUID()
        let uuidString = uuid.uuidString

        RNCallKeep.reportNewIncomingCall(
          uuidString,
          handle: "invalid",
          handleType: "generic",
          hasVideo: false,
          localizedCallerName: "invalid",
          supportsHolding: false,
          supportsDTMF: false,
          supportsGrouping: false,
          supportsUngrouping: false,
          fromPushKit: true,
          payload: payload.dictionaryPayload,
          withCompletionHandler: completion
        )
        RNCallKeep.endCall(withUUID: uuidString, reason: 1)
      }
    }
  }
}
