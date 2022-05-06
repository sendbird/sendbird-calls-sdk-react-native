import SendBirdCalls
import React

@objc(RNSendbirdCalls)
class RNSendbirdCalls: NSObject, RCTBridgeModule, RCTInvalidating {
    internal var module = CallsModule()
    
    @objc static func moduleName() -> String! {
        return "RNSendbirdCalls"
    }
    
    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc func invalidate() {
        module.invalidate()
        
        module = CallsModule()
        module.initialize()
    }
    
}

// MARK: - Test module
extension RNSendbirdCalls {
    @objc func multiply(_ a: Float, _ b: Float, _ resolve: RCTPromiseResolveBlock, _ reject: RCTPromiseRejectBlock) -> Void {
        module.multiply(a, b, resolve, reject)
    }
}

// MARK: - Common module
extension RNSendbirdCalls {
    @objc func initialize(_ appId: String, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        module.initialize(appId, Promise(resolve, reject))
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
}
