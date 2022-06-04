//
//  CallsEvents.swift
//  RNSendbirdCalls
//
//  Created by Airen Kang on 2022/05/07.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import React

class CallsEvents: RCTEventEmitter {
    enum Event {
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
    
    static let shared = CallsEvents()
    
    var hasListeners = false
    var pendingEvents: [Dictionary<String, Any?>] = []
    
    override class func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func startObserving() {
        hasListeners = true
        for event in pendingEvents {
            if let eventName = event["name"] as? CallsEvents.Event, let data = event["data"] as? Any {
                sendEvent(eventName, data, event["additionalData"] ?? nil)
            }
        }
        pendingEvents.removeAll()
    }
    
    override func stopObserving() {
        hasListeners = false
    }
    
    
    override func supportedEvents() -> [String]! {
        return [
            DefaultEventType.allCases.map{ Event.default($0).type },
            DirectCallEventType.allCases.map{ Event.directCall($0).type }
        ].flatMap{ $0 }
    }
}

// MARK: Custom event sender
extension CallsEvents {
    func sendEvent(_ event: Event, _ data: Any) {
        if (hasListeners) {
            sendEvent(withName: event.name, body: [
                "eventType": event.type,
                "data": data,
            ])
            
        } else {
            pendingEvents.append([
                "name": event,
                "data": data
            ])
        }
    }
    
    func sendEvent(_ event: Event, _ data: Any, _ additionalData: Any?) {
        if (hasListeners) {
            sendEvent(withName: event.name, body: [
                "eventType": event.type,
                "data": data,
                "additionalData": additionalData ?? [:]
            ])
            
        } else {
            pendingEvents.append([
                "name": event,
                "data": data,
                "additionalData": additionalData
            ])
        }
    }
}
