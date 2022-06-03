import SendBirdCalls
import React
import CallKit
import PushKit
import Foundation
import AVFoundation

protocol RNBridgeModuleProtocol: RCTBridgeModule, RCTInvalidating { }

@objc(RNSendbirdCalls)
class RNSendbirdCalls: NSObject, RNBridgeModuleProtocol {
    static let shared = RNSendbirdCalls()
    
    var module = CallsModule()
    
    @objc var bridge: RCTBridge!
    
    @objc func setBridge(bridge: RCTBridge) {
        self.bridge = bridge
    }
    
    @objc static func moduleName() -> String! {
        return "RNSendbirdCalls"
    }
    
    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    
    override init() {
        super.init()
    }
    
    @objc func invalidate() {
        module.invalidate()
        module = CallsModule()
    }
}

// MARK: - Common
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
    
    @objc func dial(_ calleeId: String, _ isVideoCall: Bool, _ options: [String: Any?], _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.dial(calleeId, isVideoCall, options, Promise(resolve, reject))
    }
}
