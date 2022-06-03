//
//  CallsModule+DirectCall.swift
//  RNSendbirdCalls
//
//  Created by Airen Kang on 2022/05/06.
//  Copyright © 2022 Sendbird. All rights reserved.
//

import Foundation
import SendBirdCalls
import CallKit

protocol CallsDirectCallModuleProtocol {
}

// MARK: DirectCallMethods
class CallsDirectCallModule: NSObject, CallsDirectCallModuleProtocol {
    
    
}

// MARK: DirectCallDelegate
extension CallsDirectCallModule: DirectCallDelegate {
    func didConnect(_ call: DirectCall) { }
    
    func didEnd(_ call: DirectCall) {
        var callId: UUID = UUID()
        if let callUUID = call.callUUID {
            callId = callUUID
        }
        
        CXCallManager.shared.endCall(for: callId, endedAt: Date(), reason: call.endResult)
        
        guard let callLog = call.callLog else { return }
        //UserDefaults.standard.callHistories.insert(CallHistory(callLog: callLog), at: 0)
        
        //CallHistoryViewController.main?.updateCallHistories()
    }
}
