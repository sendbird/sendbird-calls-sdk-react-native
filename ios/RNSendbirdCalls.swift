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
    
    @objc func handleRemoteNotificationData(_ data: [AnyHashable: Any]) {
        SendBirdCall.application(UIApplication.shared, didReceiveRemoteNotification: data)
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
            CallsEvents.Event.default(nil).name,
            CallsEvents.Event.directCall(nil).name,
            CallsEvents.Event.groupCall(nil).name
        ]
    }
}

// MARK: Queries
extension RNSendbirdCalls {
    @objc func createDirectCallLogListQuery(_ params: [String: Any], _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.createDirectCallLogListQuery(params, Promise(resolve,reject))
    }
    
    @objc func createRoomListQuery(_ params: [String: Any], _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.createRoomListQuery(params, Promise(resolve,reject))
    }
    
    @objc func queryNext(_ queryKey: String, _ type: String, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.queryNext(queryKey, type, Promise(resolve,reject))
    }
    
    @objc func queryRelease(_ queryKey: String) {
        module.queryRelease(queryKey)
    }
}

// MARK: Common
extension RNSendbirdCalls {
    @objc func setLoggerLevel(_ level: String) {
        module.setLoggerLevel(level)
    }
    
    @objc func addDirectCallSound(_ type: String, _ fileName: String) {
        module.addDirectCallSound(type, fileName)
    }
    
    @objc func removeDirectCallSound(_ type: String) {
        module.removeDirectCallSound(type)
    }
    
    @objc func setDirectCallDialingSoundOnWhenSilentOrVibrateMode(_ enabled: NSNumber) {
        module.setDirectCallDialingSoundOnWhenSilentOrVibrateMode(enabled.boolValue)
    }
    
    @objc func initialize(_ appId: String) -> NSNumber {
        let result = module.initialize(appId)
        return NSNumber(value: result)
    }
    
    @objc func getCurrentUser(_ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.getCurrentUser(Promise(resolve, reject))
    }
    
    @objc func getOngoingCalls(_ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.getOngoingCalls(Promise(resolve, reject))
    }
    
    @objc func getDirectCall(_ callIdOrUUID: String, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.getDirectCall(callIdOrUUID, Promise(resolve, reject))
    }
    
    @objc func authenticate(_ authParams: [String: Any], _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.authenticate(authParams, Promise(resolve, reject))
    }
    
    @objc func deauthenticate(_ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.deauthenticate(Promise(resolve, reject))
    }
    
    @objc func registerPushToken(_ token: String, _ unique: NSNumber, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.registerPushToken(token, unique.boolValue, Promise(resolve, reject))
    }
    
    @objc func unregisterPushToken(_ token: String, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.unregisterPushToken(token, Promise(resolve, reject))
    }
    
    @objc func registerVoIPPushToken(_ token: String, _ unique: NSNumber, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.registerVoIPPushToken(token, unique.boolValue, Promise(resolve, reject))
    }
    
    @objc func unregisterVoIPPushToken(_ token: String, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.unregisterVoIPPushToken(token, Promise(resolve, reject))
    }
    
    @objc func dial(_ calleeId: String, _ isVideoCall: NSNumber, _ options: [String: Any], _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.dial(calleeId, isVideoCall.boolValue, options, Promise(resolve, reject))
    }
    
    @objc func fetchRoomById(_ roomId: String, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.fetchRoomById(roomId, Promise(resolve, reject))
    }
    
    @objc func getCachedRoomById(_ roomId: String, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.getCachedRoomById(roomId, Promise(resolve, reject))
    }
    
    @objc func createRoom(_ params: [String: Any], _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.createRoom(params, Promise(resolve, reject))
    }

    @objc func updateCustomItems(_ callId: String, _ customItems: [String: String], _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.updateCustomItems(callId, customItems, Promise(resolve, reject))
    }

    @objc func deleteCustomItems(_ callId: String, _ customItemKeys: [String], _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.deleteCustomItems(callId, customItemKeys, Promise(resolve, reject))
    }

    @objc func deleteAllCustomItems(_ callId: String, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.deleteAllCustomItems(callId, Promise(resolve, reject))
    }
}

// MARK: DirectCall
extension RNSendbirdCalls {
    @objc func accept(_ callId: String, _ options: [String: Any], _ holdActiveCall: NSNumber, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.accept(callId, options, holdActiveCall.boolValue, Promise(resolve, reject))
    }
    
    @objc func end(_ callId: String, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.end(callId, Promise(resolve, reject))
    }
    
    @objc func updateLocalVideoView(_ callId: String, _ videoViewId: NSNumber) {
        module.updateLocalVideoView(callId, videoViewId)
    }
    
    @objc func updateRemoteVideoView(_ callId: String, _ videoViewId: NSNumber) {
        module.updateRemoteVideoView(callId, videoViewId)
    }

    @objc func directCallUpdateCustomItems(_ callId: String, _ customItems: [String: String], _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.directCallUpdateCustomItems(callId, customItems, Promise(resolve, reject))
    }

    @objc func directCallDeleteCustomItems(_ callId: String, _ customItemKeys: [String], _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.directCallDeleteCustomItems(callId, customItemKeys, Promise(resolve, reject))
    }

    @objc func directCallDeleteAllCustomItems(_ callId: String, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.directCallDeleteAllCustomItems(callId, Promise(resolve, reject))
    }

    @objc func startScreenShare(_ callId: String, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.startScreenShare(callId, Promise(resolve, reject))
    }

    @objc func stopScreenShare(_ callId: String, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.stopScreenShare(callId, Promise(resolve, reject))
    }
}

// MARK: GroupCall
extension RNSendbirdCalls {
    @objc func enter(_ roomId: String, _ options: [String: Any], _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.enter(roomId, options, Promise(resolve, reject))
    }

    @objc func exit(_ roomId: String) {
        module.exit(roomId)
    }

    @objc func groupCallUpdateCustomItems(_ roomId: String, _ customItems: [String: String], _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.groupCallUpdateCustomItems(roomId, customItems, Promise(resolve, reject))
    }

    @objc func groupCallDeleteCustomItems(_ roomId: String, _ customItemKeys: [String], _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.groupCallDeleteCustomItems(roomId, customItemKeys, Promise(resolve, reject))
    }

    @objc func groupCallDeleteAllCustomItems(_ roomId: String, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.groupCallDeleteAllCustomItems(roomId, Promise(resolve, reject))
    }
}

// MARK: MediaDeviceControl
extension RNSendbirdCalls {
    @objc func switchCamera(_ type: String, _ identifier: String, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.switchCamera(type, identifier, Promise(resolve, reject))
    }
    
    @objc func startVideo(_ type: String, _ identifier: String) {
        module.startVideo(type, identifier)
    }
    
    @objc func stopVideo(_ type: String, _ identifier: String) {
        module.stopVideo(type, identifier)
    }
    
    @objc func muteMicrophone(_ type: String, _ identifier: String) {
        module.muteMicrophone(type, identifier)
    }
    
    @objc func unmuteMicrophone(_ type: String, _ identifier: String) {
        module.unmuteMicrophone(type, identifier)
    }
    
    @objc func selectVideoDevice(_ type: String, _ identifier: String, _ device: [String: String], _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.selectVideoDevice(type, identifier, device, Promise(resolve, reject))
    }
}
