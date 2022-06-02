//
//  RNCallsEvents.swift
//  RNSendbirdCalls
//
//  Created by Airen Kang on 2022/05/07.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import React


enum CallsEvent {
    case `default`(_ type: DefaultEventType)
    case directCall(_ type: DirectCallEventType)
    
    var name: String {
        switch self {
        case .`default`:
            return "sendbird.call.default"
        case .directCall:
            return "sendbird.call.direct"
        }
    }
    
    var type: String {
        switch self {
        case let .default(type: type):
            return "\(self.name).\(type.rawValue)"
        case let .directCall(type: type):
            return "\(self.name).\(type.rawValue)"
        }
    }
}

enum DefaultEventType: String, CaseIterable {
    case onRinging
}

enum DirectCallEventType: String, CaseIterable {
    case onEstablished
    case onConnected
    case onReconnecting
    case onReconnected
    case onEnded
    case onRemoteAudioSettingsChanged
    case onRemoteVideoSettingsChanged
    case onLocalVideoSettingsChanged
    case onRemoteRecordingStatusChanged
    case onAudioDeviceChanged
    case onCustomItemsUpdated
    case onCustomItemsDeleted
    case onUserHoldStatusChanged
}


class RNCallsEvents: RCTEventEmitter  {
    static let shared = RNCallsEvents()
    
    override func supportedEvents() -> [String]! {
        return [
            DefaultEventType.allCases.map{ CallsEvent.default($0).type },
            DirectCallEventType.allCases.map{ CallsEvent.directCall($0).type }
        ].flatMap{ $0 }
    }
    
    func sendEvent(_ event: CallsEvent, data: Any) {
        self.sendEvent(withName: event.name, body: [
            "eventType": event.type,
            "data": data,
        ])
    }
    
    func sendEvent(_ event: CallsEvent, data: Any, additionalData: Any) {
        self.sendEvent(withName: event.name, body: [
            "eventType": event.type,
            "data": data,
            "additionalData": additionalData
        ])
    }
}
