//
//  CallsUtils.swift
//  RNSendbirdCalls
//
//  Created by Airen Kang on 2022/05/03.
//  Copyright © 2022 Sendbird. All rights reserved.
//

import Foundation
import SendBirdCalls

class CallsUtils {
    static func convertUserToDict(_ user: SendBirdCalls.User) -> [String: Any?] {
        return [
            "userId": user.userId,
            "isActive": user.isActive,
            "nickname": user.nickname ?? "",
            "metaData": user.metadata ?? [:],
            "profileUrl": user.profileURL ?? ""
        ]
    }
}
