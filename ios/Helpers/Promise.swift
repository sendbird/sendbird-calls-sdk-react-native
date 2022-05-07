//
//  Promise.swift
//  RNSendbirdCalls
//
//  Created by Airen Kang on 2022/05/04.
//  Copyright © 2022 Sendbird. All rights reserved.
//

import Foundation
import SendBirdCalls


let INTERNAL_ERROR_CODE = "RNCALLS_INTERNAL"

class Promise {
    private let resolveBlock: RCTPromiseResolveBlock
    private let rejectBlock: RCTPromiseRejectBlock
    
    enum RNCallsInternalError: Error {
        case noResponse
        case tokenParseFailure
        case unknown
        
        var message: String {
            switch(self) {
            case .noResponse:
                return "There is no response"
            case .tokenParseFailure:
                return "Failed to parse token, check token format"
            case .unknown:
                return "Unexpected error"
            }
        }
    }
    
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
    
    func reject(from: String?, error: RNCallsInternalError) {
        rejectBlock(INTERNAL_ERROR_CODE, "[\(from ?? "unknown")] \(error.message)", nil)
    }
    
    func reject(from: String?, message: String?) {
        rejectBlock(INTERNAL_ERROR_CODE, "[\(from ?? "unknown")] \(message ?? "Unexpected error")", nil)
    }
    
    func reject(_ error: SBCError) {
        let code = String(error.errorCode.rawValue)
        rejectBlock(code, error.localizedDescription, error)
    }
    
    func reject(_ code: String, _ message: String, _ error: NSError) {
        rejectBlock(code, message, error)
    }
}
