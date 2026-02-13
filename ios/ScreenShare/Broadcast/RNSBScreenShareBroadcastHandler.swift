//
//  RNSBScreenShareBroadcastHandler.swift
//  sendbird-calls-react-native
//
//  Copyright © 2026 Sendbird. All rights reserved.
//

import ReplayKit

/// Base class for the developer's Broadcast Upload Extension.
///
/// Subclass this in your Broadcast Upload Extension target:
/// ```swift
/// class SampleHandler: RNSBScreenShareBroadcastHandler {
///     override var appGroupIdentifier: String { "group.com.myapp.screenshare" }
/// }
/// ```
open class RNSBScreenShareBroadcastHandler: RPBroadcastSampleHandler {
    private static let tag = "[SBCBroadcast]"

    private var socketClient: SocketClient?
    private lazy var ciContext = CIContext(options: [.useSoftwareRenderer: false])

    /// Override this to return your App Group identifier.
    open var appGroupIdentifier: String { "" }

    /// Maximum dimension (width or height) for outgoing frames.
    /// Frames larger than this are downscaled proportionally.
    /// Default: 720p (1280). Override to customize.
    open var maxOutputDimension: Int { 1280 }

    /// Maximum number of socket connection retries before giving up.
    private static let maxConnectRetries = 5

    /// Delay between connection retries in seconds.
    private static let connectRetryInterval: TimeInterval = 0.3

    open override func broadcastStarted(withSetupInfo setupInfo: [String: NSObject]?) {
        NSLog("%@ broadcastStarted - appGroup=%@", Self.tag, appGroupIdentifier)

        guard !appGroupIdentifier.isEmpty else {
            NSLog("%@ ERROR: appGroupIdentifier is empty", Self.tag)
            finishBroadcastWithError(makeError(code: -1, message: "appGroupIdentifier is not configured"))
            return
        }

        guard let client = SocketClient(appGroupIdentifier: appGroupIdentifier) else {
            NSLog("%@ ERROR: Cannot access shared container for appGroup=%@", Self.tag, appGroupIdentifier)
            finishBroadcastWithError(makeError(code: -3, message: "Invalid App Group identifier. Cannot access shared container."))
            return
        }

        NSLog("%@ Attempting socket connection (max retries: %d)", Self.tag, Self.maxConnectRetries)
        connectWithRetry(client: client, retriesLeft: Self.maxConnectRetries)
    }

    open override func broadcastPaused() {
        NSLog("%@ broadcastPaused", Self.tag)
    }

    open override func broadcastResumed() {
        NSLog("%@ broadcastResumed", Self.tag)
    }

    open override func broadcastFinished() {
        NSLog("%@ broadcastFinished", Self.tag)
        socketClient?.disconnect()
        socketClient = nil
    }

    open override func processSampleBuffer(_ sampleBuffer: CMSampleBuffer, with sampleBufferType: RPSampleBufferType) {
        guard sampleBufferType == .video else { return }
        guard let client = socketClient else { return }
        guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }

        // Convert to BGRA (ReplayKit may provide YUV420 biplanar) and downscale if needed
        guard let bgraBuffer = convertToBGRA(pixelBuffer) else { return }

        if !sendPixelBuffer(bgraBuffer, via: client) {
            let reason = client.shutdownReason()
            NSLog("%@ Send failed (reason=%@), finishing broadcast", Self.tag, reason ?? "unexpected")
            socketClient = nil

            if let reason = reason {
                finishBroadcastWithError(makeError(code: 0, message: reason))
            } else {
                // Unexpected disconnect (e.g. app crashed)
                finishBroadcastWithError(makeError(code: -4, message: "Connection to main app lost"))
            }
        }
    }

    // MARK: - Private

    private func makeError(code: Int, message: String) -> NSError {
        NSError(
            domain: "com.sendbird.calls.broadcast",
            code: code,
            userInfo: [NSLocalizedDescriptionKey: message]
        )
    }

    private func connectWithRetry(client: SocketClient, retriesLeft: Int) {
        if client.connect() {
            NSLog("%@ Socket connected successfully", Self.tag)
            socketClient = client
            return
        }

        if retriesLeft > 0 {
            NSLog("%@ Socket connect failed, retrying in %.1fs (retries left: %d)", Self.tag, Self.connectRetryInterval, retriesLeft)
            let delay = Self.connectRetryInterval
            DispatchQueue.global(qos: .userInitiated).asyncAfter(deadline: .now() + delay) { [weak self] in
                self?.connectWithRetry(client: client, retriesLeft: retriesLeft - 1)
            }
        } else {
            NSLog("%@ ERROR: Socket connect failed after all retries", Self.tag)
            finishBroadcastWithError(makeError(code: -2, message: "Failed to connect to main app. Make sure the app is running and screen share has been started."))
        }
    }

    /// Convert any pixel format to BGRA, applying downscale if needed.
    private func convertToBGRA(_ srcBuffer: CVPixelBuffer) -> CVPixelBuffer? {
        let srcWidth = CVPixelBufferGetWidth(srcBuffer)
        let srcHeight = CVPixelBufferGetHeight(srcBuffer)

        let maxDim = maxOutputDimension
        let needsDownscale = srcWidth > maxDim || srcHeight > maxDim

        let dstWidth: Int
        let dstHeight: Int
        if needsDownscale {
            let scale = CGFloat(maxDim) / CGFloat(max(srcWidth, srcHeight))
            // Ensure even dimensions for video compatibility
            dstWidth = Int(CGFloat(srcWidth) * scale) & ~1
            dstHeight = Int(CGFloat(srcHeight) * scale) & ~1
        } else {
            dstWidth = srcWidth
            dstHeight = srcHeight
        }

        var dstBuffer: CVPixelBuffer?
        let attrs: [String: Any] = [
            kCVPixelBufferIOSurfacePropertiesKey as String: [:] as [String: Any]
        ]
        CVPixelBufferCreate(
            kCFAllocatorDefault,
            dstWidth,
            dstHeight,
            kCVPixelFormatType_32BGRA,
            attrs as CFDictionary,
            &dstBuffer
        )
        guard let dst = dstBuffer else { return nil }

        // CIContext.render does NOT auto-resize — scale the CIImage to fit the destination.
        var ciImage = CIImage(cvPixelBuffer: srcBuffer)
        let scaleX = CGFloat(dstWidth) / CGFloat(srcWidth)
        let scaleY = CGFloat(dstHeight) / CGFloat(srcHeight)
        ciImage = ciImage.transformed(by: CGAffineTransform(scaleX: scaleX, y: scaleY))
        ciContext.render(ciImage, to: dst)

        return dst
    }

    /// Returns false if the socket write failed (peer disconnected).
    @discardableResult
    private func sendPixelBuffer(_ pixelBuffer: CVPixelBuffer, via client: SocketClient) -> Bool {
        CVPixelBufferLockBaseAddress(pixelBuffer, .readOnly)
        defer { CVPixelBufferUnlockBaseAddress(pixelBuffer, .readOnly) }

        let width = CVPixelBufferGetWidth(pixelBuffer)
        let height = CVPixelBufferGetHeight(pixelBuffer)
        let bytesPerRow = CVPixelBufferGetBytesPerRow(pixelBuffer)
        let dataSize = bytesPerRow * height

        guard let baseAddress = CVPixelBufferGetBaseAddress(pixelBuffer) else { return true }

        let pixelData = Data(bytes: baseAddress, count: dataSize)
        return client.sendFrame(pixelData: pixelData, width: UInt32(width), height: UInt32(height))
    }
}
