//
//  CallsModule.swift
//  RNSendbirdCalls
//
//  Created by Airen Kang on 2022/05/03.
//  Copyright © 2022 Sendbird. All rights reserved.
//

import Foundation
import SendBirdCalls
import CallKit

class CallsModule: SendBirdCallDelegate {
    internal let commonModule = CallsCommonModule()
    internal let directCallModule = CallsDirectCallModule()
    
    init() {
        SendBirdCall.addDelegate(self, identifier: "CallsModule")
    }
    
    func invalidate() {
        SendBirdCall.deauthenticate(completionHandler: nil)
        SendBirdCall.removeAllDelegates()
        SendBirdCall.removeAllRecordingDelegates()
        SendBirdCall.getOngoingCalls().forEach { $0.end() }
    }
    
    func didStartRinging(_ call: DirectCall) {
        call.delegate = directCallModule
        
        // TODO: Extaract to @sendbird/calls-react-native-voip
        if commonModule.voipEnabled {
            guard let uuid = call.callUUID else { return }
            guard CXCallManager.shared.shouldProcessCall(for: uuid) else { return }  // Should be cross-checked with state to prevent weird event processings
            
            // Use CXProvider to report the incoming call to the system
            // Construct a CXCallUpdate describing the incoming call, including the caller.
            let name = call.caller?.userId ?? "Unknown"
            let update = CXCallUpdate()
            update.remoteHandle = CXHandle(type: .generic, value: name)
            update.hasVideo = call.isVideoCall
            update.localizedCallerName = call.caller?.userId ?? "Unknown"
            
            if SendBirdCall.getOngoingCallCount() > 1 {
                // Allow only one ongoing call.
                CXCallManager.shared.reportIncomingCall(with: uuid, update: update) { _ in
                    CXCallManager.shared.endCall(for: uuid, endedAt: Date(), reason: .declined)
                }
                call.end()
            } else {
                // Report the incoming call to the system
                CXCallManager.shared.reportIncomingCall(with: uuid, update: update)
            }
            
        }
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
    func initialize(_ appId: String) -> Bool {
        return commonModule.initialize(appId)
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
    
    func voipRegistration(_ promise: Promise) {
        commonModule.voipRegistration(promise)
    }

    func registerVoIPPushToken(_ token: String, _ unique: Bool, _ promise: Promise) {
        commonModule.registerVoIPPushToken(token, unique, promise)
    }
    
    func unregisterVoIPPushToken(_ token: String, _ promise: Promise) {
        commonModule.unregisterVoIPPushToken(token, promise)
    }
}

// MARK: - DirectCall module extension
extension CallsModule: CallsDirectCallModuleProtocol {
    
}
