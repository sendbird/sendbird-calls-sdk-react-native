//
//  ScreenShareManager+Broadcast.swift
//  RNSendbirdCalls
//
//  Copyright © 2024 Sendbird. All rights reserved.
//

import Foundation
import SendBirdCalls
import CoreMedia

// MARK: - Broadcast Mode
extension ScreenShareManager {
    struct BroadcastContext {
        var state: BroadcastScreenShareState = .idle
        var capturer: BroadcastScreenCapturer?
        var readyHandler: ReadyHandler?
        var releaseHandler: (() -> Void)?
        var notifyStateChange: (() -> Void)?

        mutating func resetCallbacks() {
            readyHandler = nil
            releaseHandler = nil
            notifyStateChange = nil
        }
    }

    func startBroadcast(
        _ promise: Promise,
        ready: @escaping ReadyHandler,
        release: @escaping () -> Void,
        notifyStateChange: @escaping () -> Void
    ) {
        guard case .idle = broadcastCtx.state else {
            broadcastCtx.capturer?.showBroadcastPicker()
            promise.resolve()
            return
        }

        broadcastCtx.readyHandler = ready
        broadcastCtx.releaseHandler = release
        broadcastCtx.notifyStateChange = notifyStateChange

        guard let appGroup = RNSBScreenSharingServiceConfig.appGroupIdentifier else {
            promise.reject(code: Self.errScreenShareFailedDueToUnknownReason,
                           message: "appGroupIdentifier is not configured")
            return
        }

        let capturer = BroadcastScreenCapturer()
        capturer.delegate = self
        capturer.start(appGroupIdentifier: appGroup,
                       extensionBundleIdentifier: RNSBScreenSharingServiceConfig.extensionBundleIdentifier)
        broadcastCtx.capturer = capturer
        broadcastCtx.state = .awaitingExtension

        capturer.showBroadcastPicker()
        promise.resolve()
    }

    func stopBroadcast(_ promise: Promise) {
        broadcastCtx.capturer?.showBroadcastPicker()
        promise.resolve()
    }

    func cleanupBroadcast() {
        broadcastCtx.state = .stopping
        broadcastCtx.releaseHandler?()
        broadcastCtx.capturer?.stop()
        broadcastCtx.capturer = nil
        broadcastCtx.resetCallbacks()
        broadcastCtx.state = .idle
    }
}

// MARK: - BroadcastScreenCapturerDelegate
extension ScreenShareManager: BroadcastScreenCapturerDelegate {
    func capturerDidStart(_ capturer: BroadcastScreenCapturer) {
        guard case .awaitingExtension = broadcastCtx.state else { return }

        broadcastCtx.state = .connectingSDK
        broadcastCtx.readyHandler? { [weak self] bufferHandler, error in
            guard let self = self else { return }

            if let error = error {
                NSLog("[SBCBroadcast] SDK startScreenShare failed: %@", error.localizedDescription)
                self.broadcastCtx.state = .idle
                self.broadcastCtx.capturer?.stop()
                self.broadcastCtx.capturer = nil
                self.broadcastCtx.resetCallbacks()
                return
            }

            guard let bufferHandler = bufferHandler else {
                NSLog("[SBCBroadcast] SDK startScreenShare returned nil handler")
                self.broadcastCtx.state = .idle
                self.broadcastCtx.capturer?.stop()
                self.broadcastCtx.capturer = nil
                self.broadcastCtx.resetCallbacks()
                return
            }

            self.broadcastCtx.state = .active(bufferHandler: bufferHandler)
            self.broadcastCtx.notifyStateChange?()
        }
    }

    func capturer(_ capturer: BroadcastScreenCapturer, didReceiveVideoFrame sampleBuffer: CMSampleBuffer) {
        guard case .active(let handler) = broadcastCtx.state else { return }
        handler(sampleBuffer, nil)
    }

    func capturerDidFinish(_ capturer: BroadcastScreenCapturer) {
        let wasActive: Bool
        if case .active = broadcastCtx.state { wasActive = true } else { wasActive = false }

        broadcastCtx.state = .idle
        broadcastCtx.capturer = nil

        if wasActive {
            NSLog("[SBCBroadcast] Extension disconnected while active, stopping SDK screen share")
            broadcastCtx.releaseHandler?()
            broadcastCtx.notifyStateChange?()
        }
        broadcastCtx.resetCallbacks()
    }

    func capturer(_ capturer: BroadcastScreenCapturer, didFailWithError error: Error) {
        NSLog("[SBCBroadcast] Capturer failed: %@", error.localizedDescription)
        broadcastCtx.state = .idle
        broadcastCtx.capturer = nil
        broadcastCtx.resetCallbacks()
    }
}
