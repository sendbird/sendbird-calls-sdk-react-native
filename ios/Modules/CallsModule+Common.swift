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
    func initialize(_ appId: String, _ promise: Promise)
    
    func getCurrentUser(_ promise: Promise)
    
    func authenticate(_ userId: String, _ accessToken: String?, _ promise: Promise)
    
    func deauthenticate(_ promise: Promise)
    
    func registerPushToken(_ token: String, _ unique: Bool, _ promise: Promise)
    
    func unregisterPushToken(_ token: String, _ promise: Promise)
    
    func voipRegistration(_ promise: Promise)
    
    func registerVoIPPushToken(_ token: String, _ unique: Bool, _ promise: Promise)
    
    func unregisterVoIPPushToken(_ token: String, _ promise: Promise)
}

class CallsCommonModule: NSObject, CallsCommonModuleProtocol {
    var voipPromise: Promise?
    var voipRegistry: PKPushRegistry?
    var voipToken: String?
    var voipEnabled: Bool {
        return voipToken != nil && voipRegistry != nil
    }
    
    func initialize(_ appId: String, _ promise: Promise) {
        let result = SendBirdCall.configure(appId: appId)
        promise.resolve(result)
    }
    
    func getCurrentUser(_ promise: Promise) {
        guard let user = SendBirdCall.currentUser else {
            return promise.resolve()
        }
        promise.resolve(CallsUtils.convertUserToDict(user))
    }
    
    func authenticate(_ userId: String, _ accessToken: String?, _ promise: Promise) {
        let authParams = AuthenticateParams(userId: userId, accessToken: accessToken)
        SendBirdCall.authenticate(with: authParams) { _user, _error in
            if let error = _error {
                UserDefaults.standard.clearRNCalls()
                promise.reject(error)
            } else if let user = _user {
                UserDefaults.standard.credential = RNCallsCredential(userId: userId, accessToken: accessToken)
                promise.resolve(CallsUtils.convertUserToDict(user))
            } else {
                UserDefaults.standard.clearRNCalls()
                promise.reject(from: "common/authenticate", error: .noResponse)
            }
        }
    }
    
    func deauthenticate(_ promise: Promise) {
        SendBirdCall.deauthenticate { _error in
            guard let error = _error else {
                UserDefaults.standard.clearRNCalls()
                return promise.resolve()
            }
            promise.reject(error)
        }
    }
    
    func registerPushToken(_ token: String, _ unique: Bool, _ promise: Promise) {
        do {
            let dataToken = try token.toDataFromHexString()
            SendBirdCall.registerRemotePush(token: dataToken, unique: unique) { _error in
                guard let error = _error else {
                    return promise.resolve()
                }
                promise.reject(error)
            }
        } catch {
            promise.reject(from: "common/registerPushToken", message: "Cannot parse token, check format of token")
        }
    }
    
    func unregisterPushToken(_ token: String, _ promise: Promise) {
        do {
            let dataToken = try token.toDataFromHexString()
            SendBirdCall.unregisterRemotePush(token: dataToken) { _error in
                guard let error = _error else {
                    return promise.resolve()
                }
                promise.reject(error)
            }
        } catch {
            promise.reject(from: "common/unregisterPushToken", message: "Cannot parse token, check format of token")
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
        do {
            let dataToken = try token.toDataFromHexString()
            SendBirdCall.registerVoIPPush(token: dataToken, unique: unique) { _error in
                guard let error = _error else {
                    return promise.resolve()
                }
                promise.reject(error)
            }
        } catch {
            promise.reject(from: "common/registerVoIPPushToken", message: "Cannot parse token, check format of token")
        }
    }
    
    func unregisterVoIPPushToken(_ token: String, _ promise: Promise) {
        do {
            let dataToken = try token.toDataFromHexString()
            SendBirdCall.unregisterVoIPPush(token: dataToken) { _error in
                guard let error = _error else {
                    return promise.resolve()
                }
                promise.reject(error)
            }
        } catch {
            promise.reject(from: "common/unregisterVoIPPushToken", message: "Cannot parse token, check format of token")
        }
    }
}


// MARK: - PKPushRegistryDelegate
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
