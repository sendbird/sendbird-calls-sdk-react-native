//
//  CallsModule+Common.swift
//  RNSendbirdCalls
//
//  Created by Airen Kang on 2022/05/03.
//  Copyright © 2022 Sendbird. All rights reserved.
//

import Foundation
import SendBirdCalls
import PushKit

protocol CallsCommonModuleProtocol {
    func getCurrentUser(_ promise: Promise)
    func getOngoingCalls(_ promise: Promise)
    
    func initialize(_ appId: String) -> Bool
    
    func authenticate(_ userId: String, _ accessToken: String?, _ promise: Promise)
    func deauthenticate(_ promise: Promise)
    
    func registerPushToken(_ token: String, _ unique: Bool, _ promise: Promise)
    func unregisterPushToken(_ token: String, _ promise: Promise)
    
    func registerVoIPPushToken(_ token: String, _ unique: Bool, _ promise: Promise)
    func unregisterVoIPPushToken(_ token: String, _ promise: Promise)
    func voipRegistration(_ promise: Promise)
    
    func dial(_ calleeId: String, _ isVideoCall: Bool, _ options: [String: Any?], _ promise: Promise)
}

class CallsCommonModule: CallsBaseModule, CallsCommonModuleProtocol {
    var voipPromise: Promise?
    var voipRegistry: PKPushRegistry?
    var voipToken: String?
    var voipEnabled: Bool {
        return voipToken != nil && voipRegistry != nil
    }
    
    func getCurrentUser(_ promise: Promise) {
        guard let user = SendBirdCall.currentUser else {
            return promise.resolve()
        }
        promise.resolve(CallsUtils.convertUserToDict(user))
    }
    
    func getOngoingCalls(_ promise: Promise) {
        let list = SendBirdCall.getOngoingCalls().map{ CallsUtils.convertDirectCallToDict($0) }
        promise.resolve(list)
    }
    
    func initialize(_ appId: String) -> Bool {
        return SendBirdCall.configure(appId: appId)
    }
    
    func authenticate(_ userId: String, _ accessToken: String?, _ promise: Promise) {
        let authParams = AuthenticateParams(userId: userId, accessToken: accessToken)
        SendBirdCall.authenticate(with: authParams) { user, error in
            if let error = error {
                UserDefaults.standard.clearRNCalls()
                promise.reject(error)
            } else if let user = user {
                UserDefaults.standard.credential = RNCallsCredential(userId: userId, accessToken: accessToken)
                promise.resolve(CallsUtils.convertUserToDict(user))
            }
        }
    }
    
    func deauthenticate(_ promise: Promise) {
        SendBirdCall.deauthenticate { error in
            if let error = error {
                promise.reject(error)
            } else {
                UserDefaults.standard.clearRNCalls()
                promise.resolve()
            }
        }
    }
    
    func registerPushToken(_ token: String, _ unique: Bool, _ promise: Promise) {
        if let dataToken = try? token.toDataFromHexString() {
            SendBirdCall.registerRemotePush(token: dataToken, unique: unique) { error in
                if let error = error {
                    promise.reject(error)
                } else {
                    promise.resolve()
                }
            }
        } else {
            promise.reject(RNCallsInternalError.tokenParseFailure("common/registerPushToken"))
        }
    }
    
    func unregisterPushToken(_ token: String, _ promise: Promise) {
        if let dataToken = try? token.toDataFromHexString() {
            SendBirdCall.unregisterRemotePush(token: dataToken) { error in
                if let error = error {
                    promise.reject(error)
                } else {
                    promise.resolve()
                }
            }
        } else {
            promise.reject(RNCallsInternalError.tokenParseFailure("common/unregisterPushToken"))
        }
    }
    
    func voipRegistration(_ promise: Promise) {
        if voipEnabled {
            promise.resolve(voipToken)
        } else {
            self.voipPromise = promise
            self.voipRegistry = PKPushRegistry(queue: DispatchQueue.main)
            self.voipRegistry?.delegate = self
            self.voipRegistry?.desiredPushTypes = [.voIP]
        }
    }
    
    func registerVoIPPushToken(_ token: String, _ unique: Bool, _ promise: Promise) {
        if let dataToken = try? token.toDataFromHexString() {
            SendBirdCall.registerVoIPPush(token: dataToken, unique: unique) { error in
                if let error = error {
                    promise.reject(error)
                } else {
                    promise.resolve()
                }
            }
        } else {
            promise.reject(RNCallsInternalError.tokenParseFailure("common/registerVoIPPushToken"))
        }
    }
    
    func unregisterVoIPPushToken(_ token: String, _ promise: Promise) {
        if let dataToken = try? token.toDataFromHexString() {
            SendBirdCall.unregisterVoIPPush(token: dataToken) { error in
                if let error = error {
                    promise.reject(error)
                } else {
                    promise.resolve()
                }
            }
        } else {
            promise.reject(RNCallsInternalError.tokenParseFailure("common/unregisterVoIPPushToken"))
        }
    }
    
    func dial(_ calleeId: String, _ isVideoCall: Bool, _ options: [String : Any?], _ promise: Promise) {
        let callOptions = CallsUtils.convertDictToCallOptions(options)
        
        let dialParams = DialParams(calleeId: calleeId, isVideoCall: isVideoCall, callOptions: callOptions)
        if let channelUrl = options["channelUrl"] as? String {
            dialParams.sendbirdChatOptions = SendBirdChatOptions(channelURL: channelUrl)
        }
        
        SendBirdCall.dial(with: dialParams) { directCall, error in
            if let error = error {
                promise.reject(error)
            } else if let directCall = directCall {
                directCall.delegate = self.root.directCallModule
                promise.resolve(CallsUtils.convertDirectCallToDict(directCall))
            }
        }
    }
}


// MARK: PKPushRegistryDelegate
extension CallsCommonModule: PKPushRegistryDelegate {
    func pushRegistry(_ registry: PKPushRegistry, didUpdate pushCredentials: PKPushCredentials, for type: PKPushType) {
        if let promise = self.voipPromise {
            voipToken = pushCredentials.token.toHexString()
            UserDefaults.standard.voipPushToken = voipToken
            promise.resolve(voipToken)
        }
        
        voipPromise = nil
    }
    
    func pushRegistry(_ registry: PKPushRegistry, didReceiveIncomingPushWith payload: PKPushPayload, for type: PKPushType) {
        SendBirdCall.pushRegistry(registry, didReceiveIncomingPushWith: payload, for: type, completionHandler: nil)
    }
}
