//
//  EventHandler.swift
//  RNSendbirdCalls
//
//  Created by Airen Kang on 2022/05/07.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import React

class EventEmitter: RCTEventEmitter  {
    enum CallsEvent: String {
        case onStartRinging
        
        enum Test {
            
        }
    }
    
    
    static let shared = EventEmitter()
    
    var rnReady = false
    var eventsQueue: [String: Array<Any>] = [:]
    
    func setReactNativeReady() {
        rnReady = true
        self.flushEvents()
    }
    
    internal func flushEvents() {
//        guard !eventsQueue.isEmpty else { return }
//        for (event, value) in eventsQueue {
//            if let event = CallsEvent(rawValue: event) {
//                self.sendEvent(event, value)
//
//            }
//        }
    }
    
    func sendEvent(_ event: CallsEvent, _ value: Any) {
//        if rnReady {
//            eventsQueue[event.rawValue]
//        } else {
//
//        }
    }
}
