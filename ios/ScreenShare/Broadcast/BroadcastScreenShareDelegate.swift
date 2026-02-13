//
//  BroadcastScreenShareDelegate.swift
//  RNSendbirdCalls
//
//  Copyright © 2024 Sendbird. All rights reserved.
//

import Foundation
import CoreMedia

/// State machine for broadcast screen sharing.
enum BroadcastScreenShareState {
    case idle
    case awaitingExtension
    case connectingSDK
    case active(bufferHandler: (CMSampleBuffer, Error?) -> Void)
    case stopping
}

/// Delegate protocol for BroadcastScreenCapturer lifecycle events.
/// All methods are called on the main queue.
protocol BroadcastScreenCapturerDelegate: AnyObject {
    func capturerDidStart(_ capturer: BroadcastScreenCapturer)
    func capturer(_ capturer: BroadcastScreenCapturer, didReceiveVideoFrame sampleBuffer: CMSampleBuffer)
    func capturerDidFinish(_ capturer: BroadcastScreenCapturer)
    func capturer(_ capturer: BroadcastScreenCapturer, didFailWithError error: Error)
}
