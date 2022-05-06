//
//  CallsCommonModule.swift
//  RNSendbirdCalls
//
//  Created by Airen Kang on 2022/05/03.
//  Copyright © 2022 Sendbird. All rights reserved.
//

import Foundation
import SendBirdCalls

protocol CallsCommonModuleProtocol {
    func initialize(_ appId: String, _ promise: Promise)
    
    func getCurrentUser(_ promise: Promise)
    
    func authenticate(_ userId: String, _ accessToken: String?, _ promise: Promise)
    
    func deauthenticate(_ promise: Promise)
    
    func registerPushToken(_ token: String, _ unique: Bool, _ promise: Promise)
    
    func unregisterPushToken(_ token: String, _ promise: Promise)
}

class CallsCommonModule: CallsCommonModuleProtocol {
    func initialize(_ appId: String, _ promise: Promise) {
        let result = SendBirdCall.configure(appId: appId)
        promise.resolve(result)
    }
    
    func getCurrentUser(_ promise: Promise) {
        guard let user = SendBirdCall.currentUser else {
            return promise.resolve()
        }
        promise.resolve(user)
    }
    
    func authenticate(_ userId: String, _ accessToken: String?, _ promise: Promise) {
        let authParams = AuthenticateParams(userId: userId, accessToken: accessToken)
        SendBirdCall.authenticate(with: authParams) { _user, _error in
            if let error = _error {
                promise.reject(error)
            } else if let user = _user {
                promise.resolve(user)
            } else {
                promise.reject(from: "common/authenticate", message: "Not determined any responses")
            }
        }
    }
    
    func deauthenticate(_ promise: Promise) {
        SendBirdCall.deauthenticate { _error in
            guard let error = _error else {
                return promise.resolve()
            }
            promise.reject(error)
        }
    }
    
    func registerPushToken(_ token: String, _ unique: Bool, _ promise: Promise) {
        do {
            let dataToken = try token.toDataFromHexString()
            SendBirdCall.registerRemotePush(token: dataToken) { _error in
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
}
