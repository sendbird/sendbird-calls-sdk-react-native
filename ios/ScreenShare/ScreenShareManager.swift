//
//  ScreenShareManager.swift
//  RNSendbirdCalls
//
//  Copyright © 2022 Sendbird. All rights reserved.
//

import Foundation
import SendBirdCalls
import CoreMedia

class ScreenShareManager {
    static let errScreenShareFailedDueToUnknownReason = 1800626
    static let errPermissionDeniedForScreenShare = 1800628

    typealias BufferHandler = (CMSampleBuffer, Error?) -> Void
    typealias ReadyHandler = (@escaping (BufferHandler?, SBCError?) -> Void) -> Void

    var isBroadcastMode: Bool {
        RNSBScreenShareServiceConfig.appGroupIdentifier != nil
    }

    var broadcastCtx = BroadcastContext()
    var inAppPromise: Promise?

    // MARK: - Public API
    func start(
        _ promise: Promise,
        ready: @escaping ReadyHandler,
        release: @escaping () -> Void,
        notifyStateChange: @escaping () -> Void
    ) {
        if isBroadcastMode {
            startBroadcast(promise, ready: ready, release: release, notifyStateChange: notifyStateChange)
        } else {
            startInApp(promise, ready: ready, release: release, notifyStateChange: notifyStateChange)
        }
    }

    func stop(
        _ promise: Promise,
        release: ((@escaping (SBCError?) -> Void) -> Void)? = nil,
        notifyStateChange: (() -> Void)? = nil
    ) {
        if isBroadcastMode {
            stopBroadcast(promise)
        } else {
            stopInApp(promise, release: release, notifyStateChange: notifyStateChange)
        }
    }

    func cleanup(reason: String = "Screen sharing has ended") {
        if isBroadcastMode {
            cleanupBroadcast(reason: reason)
        } else {
            cleanupInApp()
        }
    }
}
