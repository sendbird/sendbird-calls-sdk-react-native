//
//  SampleHandler.swift
//  BroadcastExtension
//
//  Copyright © 2024 Sendbird. All rights reserved.
//

import sendbird_calls_react_native

class SampleHandler: RNSBScreenShareBroadcastHandler {
    override var appGroupIdentifier: String {
        "group.com.sendbird.calls.reactnative.sample.app"
    }
}
