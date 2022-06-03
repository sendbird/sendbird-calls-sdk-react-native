//
//  RNCallsInternalError.swift
//  RNSendbirdCalls
//
//  Created by Airen Kang on 2022/06/03.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation

static let INTERNAL_ERROR_CODE = "RNCALLS_INTERNAL"
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
