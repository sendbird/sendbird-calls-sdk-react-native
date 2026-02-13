//
//  BroadcastScreenCapturerDelegate.swift
//  RNSendbirdCalls
//
//  Copyright © 2026 Sendbird. All rights reserved.
//

import Foundation
import CoreMedia

/// Delegate protocol for BroadcastScreenCapturer lifecycle events.
/// All methods are called on the main queue.
protocol BroadcastScreenCapturerDelegate: AnyObject {
    func capturerDidStart(_ capturer: BroadcastScreenCapturer)
    func capturer(_ capturer: BroadcastScreenCapturer, didReceiveVideoFrame sampleBuffer: CMSampleBuffer)
    func capturerDidFinish(_ capturer: BroadcastScreenCapturer)
    func capturer(_ capturer: BroadcastScreenCapturer, didFailWithError error: Error)
}
