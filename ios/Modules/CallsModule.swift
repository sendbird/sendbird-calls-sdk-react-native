//
//  CallsModule.swift
//  RNSendbirdCalls
//
//  Created by Airen Kang on 2022/05/03.
//  Copyright © 2022 Sendbird. All rights reserved.
//

import Foundation
import SendBirdCalls

class CallsModule: SendBirdCallDelegate {
    internal let commonModule = CallsCommonModule()
    internal let directCallModule = CallsDirectCallModule()
    
    func initialize() {
        SendBirdCall.addDelegate(self, identifier: "CallsModule")
    }
    
    func invalidate() {
        SendBirdCall.deauthenticate(completionHandler: nil)
        SendBirdCall.removeAllDelegates()
        SendBirdCall.removeAllRecordingDelegates()
    }
    
    func didStartRinging(_ call: DirectCall) {
        call.delegate = directCallModule
    }
}

// MARK: - Test module extension
extension CallsModule {
    func multiply(_ a: Float, _ b: Float, _ resolve: RCTPromiseResolveBlock, _ reject: RCTPromiseRejectBlock) {
        resolve(a * b)
    }
}

// MARK: - Common module extension
extension CallsModule: CallsCommonModuleProtocol {
    func initialize(_ appId: String, _ promise: Promise) {
        commonModule.initialize(appId, promise)
    }
    
    func getCurrentUser(_ promise: Promise) {
        commonModule.getCurrentUser(promise)
    }
    
    func authenticate(_ userId: String, _ accessToken: String?, _ promise: Promise) {
        commonModule.authenticate(userId, accessToken, promise)
    }
    
    func deauthenticate(_ promise: Promise) {
        commonModule.deauthenticate(promise)
    }
    
    func registerPushToken(_ token: String, _ unique: Bool, _ promise: Promise) {
        commonModule.registerPushToken(token, unique, promise)
    }
    
    func unregisterPushToken(_ token: String, _ promise: Promise) {
        commonModule.unregisterPushToken(token, promise)
    }
}

// MARK: - DirectCall module extension
extension CallsModule: CallsDirectCallModuleProtocol {
    
}
