//
//  String+Extension.swift
//  RNSendbirdCalls
//
//  Created by Airen Kang on 2022/05/04.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation

extension String {
    func charAt(_ offset: Int) -> Character {
        return String(self[self.index(self.startIndex, offsetBy: offset)])
    }
    
    func strAt(_ offset: Int) -> String {
        return String(self.charAt(offset))
    }
    
    func toDataFromHexString() throws -> Data {
        var data = Data(capacity: self.count / 2)
        for i in stride(from: 0, to: self.count, by: 2) {
            let hexPair = self.strAt(i) + self.strAt(i+1)
            if let byte = UInt8(hexPair, radix:16) {
                data.append(byte)
            } else {
                fatalError()
            }
        }
        return data;
    }
}
