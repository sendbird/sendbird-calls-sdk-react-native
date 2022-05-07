//
//  SendBirdCalls+Extension.swift
//  RNSendbirdCalls
//
//  Created by Jaesung Lee on 2020/04/13.
//  Copyright © 2020 Sendbird Inc. All rights reserved.
//
// TODO: Extaract to @sendbird/calls-react-native-voip

import UIKit
import SendBirdCalls

extension SendBirdCall {
    /**
     This method uses when,
     - the user makes outgoing calls from native call history("Recents")
     - the provider performs the specified end(decline) or answer call action.
     */
    static func authenticateIfNeed(completionHandler: @escaping (Error?) -> Void) {
        guard SendBirdCall.currentUser == nil else {
            completionHandler(nil)
            return
        }
        
        guard let credential = UserDefaults.standard.credential else { return }
        
        let params = AuthenticateParams(userId: credential.userId, accessToken: credential.accessToken)
        SendBirdCall.authenticate(with: params) { (_, error) in
            completionHandler(error)
        }
    }
}
