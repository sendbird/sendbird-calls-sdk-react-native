//
//  RNSBScreenShareBroadcastHandler.swift
//  sendbird-calls-react-native
//
//  Copyright © 2024 Sendbird. All rights reserved.
//

import ReplayKit
import Accelerate

/// Base class for the developer's Broadcast Upload Extension.
///
/// Subclass this in your Broadcast Upload Extension target:
/// ```swift
/// class SampleHandler: RNSBScreenShareBroadcastHandler {
///     override var appGroupIdentifier: String { "group.com.myapp.screenshare" }
/// }
/// ```
open class RNSBScreenShareBroadcastHandler: RPBroadcastSampleHandler {
    private var socketClient: SocketClient?

    /// Override this to return your App Group identifier.
    open var appGroupIdentifier: String { "" }

    /// Maximum dimension (width or height) for outgoing frames.
    /// Frames larger than this are downscaled proportionally.
    /// Default: 720p (1280). Override to customize.
    open var maxOutputDimension: Int { 1280 }

    open override func broadcastStarted(withSetupInfo setupInfo: [String: NSObject]?) {
        guard !appGroupIdentifier.isEmpty else {
            let error = NSError(
                domain: "com.sendbird.calls.broadcast",
                code: -1,
                userInfo: [NSLocalizedDescriptionKey: "appGroupIdentifier is not configured"]
            )
            finishBroadcastWithError(error)
            return
        }

        guard let client = SocketClient(appGroupIdentifier: appGroupIdentifier) else {
            let error = NSError(
                domain: "com.sendbird.calls.broadcast",
                code: -3,
                userInfo: [NSLocalizedDescriptionKey: "Invalid App Group identifier. Cannot access shared container."]
            )
            finishBroadcastWithError(error)
            return
        }
        if client.connect() {
            socketClient = client
        } else {
            let error = NSError(
                domain: "com.sendbird.calls.broadcast",
                code: -2,
                userInfo: [NSLocalizedDescriptionKey: "Failed to connect to main app. Make sure the app is running and screen share has been started."]
            )
            finishBroadcastWithError(error)
        }
    }

    open override func broadcastPaused() {
        // No-op: frames stop arriving but connection stays open
    }

    open override func broadcastResumed() {
        // No-op: frames resume automatically
    }

    open override func broadcastFinished() {
        socketClient?.disconnect()
        socketClient = nil
    }

    open override func processSampleBuffer(_ sampleBuffer: CMSampleBuffer, with sampleBufferType: RPSampleBufferType) {
        guard sampleBufferType == .video else { return }
        guard let client = socketClient else { return }
        guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }

        let srcWidth = CVPixelBufferGetWidth(pixelBuffer)
        let srcHeight = CVPixelBufferGetHeight(pixelBuffer)

        // Downscale if needed
        let maxDim = maxOutputDimension
        if srcWidth > maxDim || srcHeight > maxDim,
           let scaled = downscalePixelBuffer(pixelBuffer, maxDimension: maxDim) {
            sendPixelBuffer(scaled, via: client)
        } else {
            sendPixelBuffer(pixelBuffer, via: client)
        }
    }

    // MARK: - Private

    private func sendPixelBuffer(_ pixelBuffer: CVPixelBuffer, via client: SocketClient) {
        CVPixelBufferLockBaseAddress(pixelBuffer, .readOnly)
        defer { CVPixelBufferUnlockBaseAddress(pixelBuffer, .readOnly) }

        let width = CVPixelBufferGetWidth(pixelBuffer)
        let height = CVPixelBufferGetHeight(pixelBuffer)
        let bytesPerRow = CVPixelBufferGetBytesPerRow(pixelBuffer)
        let dataSize = bytesPerRow * height

        guard let baseAddress = CVPixelBufferGetBaseAddress(pixelBuffer) else { return }

        let pixelData = Data(bytes: baseAddress, count: dataSize)
        client.sendFrame(pixelData: pixelData, width: UInt32(width), height: UInt32(height))
    }

    private func downscalePixelBuffer(_ srcBuffer: CVPixelBuffer, maxDimension: Int) -> CVPixelBuffer? {
        let srcWidth = CVPixelBufferGetWidth(srcBuffer)
        let srcHeight = CVPixelBufferGetHeight(srcBuffer)

        let scale = CGFloat(maxDimension) / CGFloat(max(srcWidth, srcHeight))
        let dstWidth = Int(CGFloat(srcWidth) * scale)
        let dstHeight = Int(CGFloat(srcHeight) * scale)

        // Ensure even dimensions for video compatibility
        let alignedWidth = dstWidth & ~1
        let alignedHeight = dstHeight & ~1

        var dstBuffer: CVPixelBuffer?
        let attrs: [String: Any] = [
            kCVPixelBufferIOSurfacePropertiesKey as String: [:] as [String: Any]
        ]
        CVPixelBufferCreate(
            kCFAllocatorDefault,
            alignedWidth,
            alignedHeight,
            kCVPixelFormatType_32BGRA,
            attrs as CFDictionary,
            &dstBuffer
        )
        guard let dst = dstBuffer else { return nil }

        // Use Accelerate vImage for fast, high-quality downscale
        CVPixelBufferLockBaseAddress(srcBuffer, .readOnly)
        CVPixelBufferLockBaseAddress(dst, [])
        defer {
            CVPixelBufferUnlockBaseAddress(srcBuffer, .readOnly)
            CVPixelBufferUnlockBaseAddress(dst, [])
        }

        guard let srcBase = CVPixelBufferGetBaseAddress(srcBuffer),
              let dstBase = CVPixelBufferGetBaseAddress(dst) else { return nil }

        var srcVImage = vImage_Buffer(
            data: srcBase,
            height: vImagePixelCount(srcHeight),
            width: vImagePixelCount(srcWidth),
            rowBytes: CVPixelBufferGetBytesPerRow(srcBuffer)
        )
        var dstVImage = vImage_Buffer(
            data: dstBase,
            height: vImagePixelCount(alignedHeight),
            width: vImagePixelCount(alignedWidth),
            rowBytes: CVPixelBufferGetBytesPerRow(dst)
        )

        let error = vImageScale_ARGB8888(&srcVImage, &dstVImage, nil, vImage_Flags(kvImageHighQualityResampling))
        guard error == kvImageNoError else { return nil }

        return dst
    }
}
