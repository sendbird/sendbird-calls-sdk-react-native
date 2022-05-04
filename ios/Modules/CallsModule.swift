//
//  CallsModule.swift
//  RNSendbirdCalls
//
//  Created by Airen Kang on 2022/05/03.
//  Copyright © 2022 Sendbird. All rights reserved.
//

import Foundation
import SendBirdCalls

class CallsDirectCallModule: DirectCallDelegate {
    func didConnect(_ call: DirectCall) {
        <#code#>
    }
    
    func didEnd(_ call: DirectCall) {
        <#code#>
    }
}

class CallsModule: SendBirdCallDelegate {
    internal let commonModule = CallsCommonModule()
    internal let directCallModule = CallsDirectCallModule()
    
    init() {
        self.initialize()
    }
    
    func initialize() {
        SendBirdCall.addDelegate(self, identifier: "CallsModule")
    }
    
    func invalidate(completionHandler: SendBirdCalls.ErrorHandler?) {
        SendBirdCall.deauthenticate(completionHandler: completionHandler)
        SendBirdCall.removeAllDelegates()
        SendBirdCall.removeAllRecordingDelegates()
        self.initialize()
    }
    
    func didStartRinging(_ call: DirectCall) {
        call.delegate = directCallModule
    }
}

// MARK: - Test module protocol
protocol TestModule {
    func multiply(_ a: Float, _ b: Float, _ resolve: RCTPromiseResolveBlock, _ reject: RCTPromiseRejectBlock) -> Void
}

// MARK: - Test module extends
extension CallsModule: TestModule {
    func multiply(_ a: Float, _ b: Float, _ resolve: RCTPromiseResolveBlock, _ reject: RCTPromiseRejectBlock) {
        resolve(a * b)
    }
}
