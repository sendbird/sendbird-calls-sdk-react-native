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
import React

class CallsBaseModule: NSObject {
    internal var root: CallsModule
    init(root: CallsModule) {
        self.root = root
    }
}

class CallsModule: SendBirdCallDelegate {
    internal lazy var commonModule: CallsCommonModule = {
        CallsCommonModule(root: self)
    }()
    
    internal lazy var directCallModule: CallsDirectCallModule = {
        CallsDirectCallModule(root: self)
    }()
    
    internal var initialized: Bool {
        get {
            return SendBirdCall.appId != nil
        }
    }
    
    init() {
        SendBirdCall.addDelegate(self, identifier: "sendbird.call.listener")
    }
    
    func invalidate() {
        if(initialized){
            SendBirdCall.deauthenticate(completionHandler: nil)
            SendBirdCall.removeAllDelegates()
            SendBirdCall.removeAllRecordingDelegates()
            SendBirdCall.getOngoingCalls().forEach { $0.end() }
        }
    }
    
    func didStartRinging(_ call: DirectCall) {
        DispatchQueue.main.async {
            CallsEvents.shared.sendEvent(.default(.onRinging), CallsUtils.convertDirectCallToDict(call))
            call.delegate = self.directCallModule
        }
    }
}

// MARK: Common module extension
extension CallsModule: CallsCommonModuleProtocol {
    func getCurrentUser(_ promise: Promise) {
        commonModule.getCurrentUser(promise)
    }
    
    func getOngoingCalls(_ promise: Promise) {
        commonModule.getOngoingCalls(promise)
    }
    
    func getDirectCall(_ callIdOrUUID: String, _ promise: Promise) {
        commonModule.getDirectCall(callIdOrUUID, promise)
    }
    
    func initialize(_ appId: String) -> Bool {
        return commonModule.initialize(appId)
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
    
    func registerVoIPPushToken(_ token: String, _ unique: Bool, _ promise: Promise) {
        commonModule.registerVoIPPushToken(token, unique, promise)
    }
    
    func unregisterVoIPPushToken(_ token: String, _ promise: Promise) {
        commonModule.unregisterVoIPPushToken(token, promise)
    }
    
    func dial(_ calleeId: String, _ isVideoCall: Bool, _ options: [String: Any?], _ promise: Promise) {
        commonModule.dial(calleeId, isVideoCall, options, promise)
    }
}

// MARK: - DirectCall module extension
extension CallsModule: CallsDirectCallModuleProtocol {
    func selectVideoDevice(_ callId: String, _ device: [String: String], _ promise: Promise) {
        directCallModule.selectVideoDevice(callId, device, promise)
    }
    
    func accept(_ callId: String, _ options: [String : Any?], _ holdActiveCall: Bool, _ promise: Promise) {
        directCallModule.accept(callId, options, holdActiveCall, promise)
    }
    
    func end(_ callId: String, _ promise: Promise) {
        directCallModule.end(callId, promise)
    }
    
    func switchCamera(_ callId: String, _ promise: Promise) {
        directCallModule.switchCamera(callId, promise)
    }
    
    func startVideo(_ callId: String) {
        directCallModule.startVideo(callId)
    }
    
    func stopVideo(_ callId: String) {
        directCallModule.stopVideo(callId)
    }
    
    func muteMicrophone(_ callId: String) {
        directCallModule.muteMicrophone(callId)
    }
    
    func unmuteMicrophone(_ callId: String) {
        directCallModule.unmuteMicrophone(callId)
    }
    
    func updateLocalVideoView(_ callId: String, _ videoViewId: NSNumber) {
        directCallModule.updateLocalVideoView(callId, videoViewId)
    }
    
    func updateRemoteVideoView(_ callId: String, _ videoViewId: NSNumber) {
        directCallModule.updateRemoteVideoView(callId, videoViewId)
    }
}
