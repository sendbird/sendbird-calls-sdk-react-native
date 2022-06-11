import SendBirdCalls
import React
import CallKit
import PushKit
import Foundation
import AVFoundation
import AVKit

@objc(RNSendbirdCalls)
class RNSendbirdCalls: RCTEventEmitter {
    internal var module = CallsModule()
    
    override init() {
        super.init()
        CallsEvents.shared.eventEmitter = self
    }
    
    @objc override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc override static func moduleName() -> String! {
        return "RNSendbirdCalls"
    }
    
    @objc override func constantsToExport() -> [AnyHashable : Any]! {
        return [
            "NATIVE_SDK_VERSION": SendBirdCall.sdkVersion
        ]
    }
    
    @objc override func invalidate() {
        super.invalidate()
        module.invalidate()
        module = CallsModule()
    }
    
    @objc func handleRemoteNotificationData(data: [AnyHashable: Any]) {
        SendBirdCall.application(UIApplication.shared, didReceiveRemoteNotification: data)
    }
    
    @objc func handleVoIPNotificationData(data: [AnyHashable: Any]) {
        // SendBirdCall.pushRegistry(T##registry: PKPushRegistry##PKPushRegistry, didReceiveIncomingPushWith: T##PKPushPayload, for: T##PKPushType, completionHandler: T##PushRegistryHandler?##PushRegistryHandler?##(UUID?) -> Void)
    }
    
    @objc func routePickerView() {
        guard #available(iOS 11.0, *),
              let routePickerView = SendBirdCall.routePickerView(frame: .zero) as? AVRoutePickerView,
              let button = routePickerView.subviews.first(where: { $0 is UIButton }) as? UIButton
        else { return }
        
        button.sendActions(for: .touchUpInside)
    }
}

// MARK: RCTEventEmitter
extension RNSendbirdCalls {
    override func startObserving() {
        CallsEvents.shared.startObserving()
    }
    override func stopObserving() {
        CallsEvents.shared.stopObserving()
    }
    override func supportedEvents() -> [String]! {
        return [
            CallsEvents.Event.default(.onRinging).name,
            CallsEvents.Event.directCall(.onConnected).name
        ]
    }
}

// MARK: Common
extension RNSendbirdCalls {
    @objc func initialize(_ appId: String) -> Bool {
        return module.initialize(appId)
    }
    
    @objc func getCurrentUser(_ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.getCurrentUser(Promise(resolve, reject))
    }
    
    @objc func authenticate(_ userId: String, _ accessToken: String?, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.authenticate(userId, accessToken, Promise(resolve, reject))
    }
    
    @objc func deauthenticate(_ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.deauthenticate(Promise(resolve, reject))
    }
    
    @objc func registerPushToken(_ token: String, _ unique: Bool, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.registerPushToken(token, unique, Promise(resolve, reject))
    }
    
    @objc func unregisterPushToken(_ token: String, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.unregisterPushToken(token, Promise(resolve, reject))
    }
    
    @objc func voipRegistration(_ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.voipRegistration(Promise(resolve, reject))
    }
    
    @objc func registerVoIPPushToken(_ token: String, _ unique: Bool, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.registerVoIPPushToken(token, unique, Promise(resolve, reject))
    }
    
    @objc func unregisterVoIPPushToken(_ token: String, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.unregisterVoIPPushToken(token, Promise(resolve, reject))
    }
    
    @objc func dial(_ calleeId: String, _ isVideoCall: Bool, _ options: [String: Any], _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.dial(calleeId, isVideoCall, options, Promise(resolve, reject))
    }
}

// MARK: DirectCall
extension RNSendbirdCalls {
    @objc func selectVideoDevice(_ callId: String, _ device: [String: String], _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.selectVideoDevice(callId, device, Promise(resolve, reject))
    }
    
    @objc func accept(_ callId: String, _ options: [String: Any], _ holdActiveCall: Bool, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.accept(callId, options, holdActiveCall, Promise(resolve, reject))
    }
    
    @objc func end(_ callId: String, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.end(callId, Promise(resolve, reject))
    }
    
    @objc func switchCamera(_ callId: String, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.switchCamera(callId, Promise(resolve, reject))
    }
    
    @objc func startVideo(_ callId: String) {
        module.startVideo(callId)
    }
    
    @objc func stopVideo(_ callId: String) {
        module.stopVideo(callId)
    }
    
    @objc func muteMicrophone(_ callId: String) {
        module.muteMicrophone(callId)
    }
    
    @objc func unmuteMicrophone(_ callId: String) {
        module.unmuteMicrophone(callId)
    }
    
    @objc func updateLocalVideoView(_ callId: String, _ videoViewId: NSNumber) {
        module.updateLocalVideoView(callId, videoViewId)
    }
    
    @objc func updateRemoteVideoView(_ callId: String, _ videoViewId: NSNumber) {
        module.updateRemoteVideoView(callId, videoViewId)
    }
}
