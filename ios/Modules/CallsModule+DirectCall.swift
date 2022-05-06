//
//  CallsModule+DirectCall.swift
//  RNSendbirdCalls
//
//  Created by Airen Kang on 2022/05/06.
//  Copyright © 2022 Sendbird. All rights reserved.
//

import Foundation
import SendBirdCalls

protocol CallsDirectCallModuleProtocol {
    
}

class CallsDirectCallModule: CallsDirectCallModuleProtocol {
    
}

// MARK: - DirectCallDelegate
extension CallsDirectCallModule: DirectCallDelegate {
    func didConnect(_ call: DirectCall) {
        <#code#>
    }
    
    func didEnd(_ call: DirectCall) {
        <#code#>
    }
}
