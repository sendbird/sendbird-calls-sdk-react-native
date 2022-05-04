//
//  Promise.swift
//  RNSendbirdCalls
//
//  Created by Airen Kang on 2022/05/04.
//  Copyright © 2022 Sendbird. All rights reserved.
//

import Foundation
import SendBirdCalls

class Promise {
    private let resolveBlock: RCTPromiseResolveBlock
    private let rejectBlock: RCTPromiseRejectBlock
    
    init(_ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
        self.resolveBlock = resolve
        self.rejectBlock = reject;
    }
    
    func resolve() {
        resolveBlock(nil)
    }
    
    func resolve(_ value: Any?) {
        resolveBlock(value)
    }
    
    func reject(from: String?, message: String?) {
        let code = String(SBCError.ErrorCode.unknownError.rawValue)
        rejectBlock(code, "[\(from ?? "unknown")] \(message ?? "Unexpected error")", nil)
    }
    
    func reject(_ error: SBCError) {
        let code = String(error.errorCode.rawValue)
        rejectBlock(code, error.localizedDescription, error)
    }
    
    func reject(_ code: String, _ message: String, _ error: NSError) {
        rejectBlock(code, message, error)
    }
}
