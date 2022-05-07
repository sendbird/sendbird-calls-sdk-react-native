//
//  UserDefaults+Extension.swift
//  RNSendbirdCalls
//
//  Created by Jaesung Lee on 2020/04/13.
//  Copyright © 2020 Sendbird Inc. All rights reserved.
//

import Foundation

class RNCallsCredential: Codable {
    let userId: String
    let accessToken: String?
    
    init(userId: String, accessToken: String?) {
        self.userId = userId
        self.accessToken = accessToken
    }
}

extension UserDefaults {
    enum RNCallsKey: String, CaseIterable {
        case credential
        case voipPushToken
        
        var value: String { "sendbird.calls.reactnative.\(self.rawValue.lowercased())" }
    }
    
    var credential: RNCallsCredential? {
        get { UserDefaults.standard.getCodable(objectType: RNCallsCredential.self,
                                        forKey: RNCallsKey.credential.value) }
        set { UserDefaults.standard.setCodable(object: newValue,
                                        forKey: RNCallsKey.credential.value) }
    }
    
    var voipPushToken: String? {
        get { UserDefaults.standard.string(forKey: RNCallsKey.voipPushToken.value) }
        set { UserDefaults.standard.set(newValue, forKey: RNCallsKey.voipPushToken.value) }
    }
    
    func clearRNCalls() {
        RNCallsKey.allCases
            .filter { $0 != .voipPushToken }
            .map { $0.value }
            .forEach(UserDefaults.standard.removeObject)
    }
}

extension UserDefaults {
    func setCodable<T: Codable>(object: T, forKey: String) {
        guard let jsonData = try? JSONEncoder().encode(object) else {
            self.removeObject(forKey: forKey)
            return
        }
        set(jsonData, forKey: forKey)
    }

    func getCodable<T: Codable>(objectType: T.Type, forKey: String) -> T? {
        guard let result = value(forKey: forKey) as? Data else { return nil }
        return try? JSONDecoder().decode(objectType, from: result)
    }
}
