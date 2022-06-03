//
//  String+Extension.swift
//  RNSendbirdCalls
//
//  Created by Airen Kang on 2022/05/04.
//  Copyright © 2022 Sendbird. All rights reserved.
//

import Foundation

extension String {
    func toDataFromHexString() throws -> Data {
        if (!self.count.isMultiple(of: 2)) {
            throw RNCallsInternalError.tokenParseFailure("toDataFromHexString")
        }

        let chars = self.map({ String($0) })
        var data = Data(capacity: self.count / 2)
        for i in stride(from: 0, to: self.count, by: 2) {
            let hex = chars[0] + chars[i+1]
            if let byte = UInt8(hex, radix:16) {
                data.append(byte)
            } else {
                throw RNCallsInternalError.tokenParseFailure("toDataFromHexString/castingByte")
            }
        }
        return data;
    }
}
