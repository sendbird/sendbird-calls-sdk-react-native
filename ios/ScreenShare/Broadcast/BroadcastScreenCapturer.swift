//
//  BroadcastScreenCapturer.swift
//  sendbird-calls-react-native
//
//  Copyright © 2026 Sendbird. All rights reserved.
//

import Foundation
import ReplayKit
import CoreVideo
import CoreMedia

class BroadcastScreenCapturer {
    private static let tag = "[SBCBroadcast]"

    weak var delegate: BroadcastScreenCapturerDelegate?

    private var socketServer: SocketServer?
    private var pixelBufferPool: CVPixelBufferPool?
    private var poolWidth: Int = 0
    private var poolHeight: Int = 0

    private enum State {
        case idle
        case awaitingExtension
        case active
        case stopped
    }
    private var state: State = .idle

    private var extensionBundleIdentifier: String?

    func start(appGroupIdentifier: String, extensionBundleIdentifier: String?) {
        guard case .idle = state else {
            NSLog("%@ start() called in non-idle state, ignoring", Self.tag)
            return
        }

        self.extensionBundleIdentifier = extensionBundleIdentifier

        guard let server = SocketServer(appGroupIdentifier: appGroupIdentifier) else {
            let error = NSError(
                domain: "com.sendbird.calls.broadcast",
                code: -3,
                userInfo: [NSLocalizedDescriptionKey: "Invalid App Group identifier. Cannot access shared container."]
            )
            DispatchQueue.main.async { [weak self] in
                guard let self = self else { return }
                self.delegate?.capturer(self, didFailWithError: error)
            }
            return
        }

        server.onClientConnected = { [weak self] in
            self?.handleClientConnected()
        }
        server.onFrameReceived = { [weak self] pixelData, width, height in
            self?.handleReceivedFrame(pixelData: pixelData, width: width, height: height)
        }
        server.onClientDisconnected = { [weak self] in
            self?.handleClientDisconnected()
        }

        server.clearShutdownSignal()

        guard server.start() else {
            let error = NSError(
                domain: "com.sendbird.calls.broadcast",
                code: -1,
                userInfo: [NSLocalizedDescriptionKey: "Failed to start socket server"]
            )
            DispatchQueue.main.async { [weak self] in
                guard let self = self else { return }
                self.delegate?.capturer(self, didFailWithError: error)
            }
            return
        }

        socketServer = server
        state = .awaitingExtension
        NSLog("%@ Server started, awaiting extension connection", Self.tag)
    }

    func showBroadcastPicker() {
        NSLog("%@ Showing broadcast picker (extensionBundleId: %@)", Self.tag, extensionBundleIdentifier ?? "nil")
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            let pickerView = RPSystemBroadcastPickerView(frame: CGRect(x: 0, y: 0, width: 1, height: 1))
            pickerView.showsMicrophoneButton = false
            if let extensionId = self.extensionBundleIdentifier {
                pickerView.preferredExtension = extensionId
            }
            for subview in pickerView.subviews {
                if let button = subview as? UIButton {
                    button.sendActions(for: .touchUpInside)
                    break
                }
            }
        }
    }

    func stop(reason: String = "Screen sharing has ended", completion: (() -> Void)? = nil) {
        state = .stopped
        // Signal graceful shutdown so the extension knows it was intentional
        socketServer?.signalShutdownAndStop(reason: reason)
        socketServer = nil
        pixelBufferPool = nil
        poolWidth = 0
        poolHeight = 0
        completion?()
    }

    // MARK: - Private: Socket Event Handlers

    private func handleClientConnected() {
        // Already on main queue (SocketServer dispatches to main)
        NSLog("%@ Extension connected to server", Self.tag)
        guard case .awaitingExtension = state else { return }
        state = .active
        delegate?.capturerDidStart(self)
    }

    private func handleReceivedFrame(pixelData: Data, width: UInt32, height: UInt32) {
        guard let sampleBuffer = createSampleBuffer(from: pixelData, width: Int(width), height: Int(height)) else {
            return
        }

        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            guard case .active = self.state else { return }
            self.delegate?.capturer(self, didReceiveVideoFrame: sampleBuffer)
        }
    }

    private func handleClientDisconnected() {
        // Already on main queue (SocketServer dispatches to main)
        NSLog("%@ Extension disconnected", Self.tag)
        guard state != .stopped else { return }

        state = .idle
        socketServer?.stop()
        socketServer = nil

        delegate?.capturerDidFinish(self)
    }

    // MARK: - Private: Pixel Buffer / Sample Buffer

    private func getOrCreatePool(width: Int, height: Int) -> CVPixelBufferPool? {
        if let pool = pixelBufferPool, poolWidth == width, poolHeight == height {
            return pool
        }

        // Recreate pool for new dimensions
        pixelBufferPool = nil

        let poolAttrs: [String: Any] = [
            kCVPixelBufferPoolMinimumBufferCountKey as String: 3
        ]
        let bufferAttrs: [String: Any] = [
            kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
            kCVPixelBufferWidthKey as String: width,
            kCVPixelBufferHeightKey as String: height,
            kCVPixelBufferIOSurfacePropertiesKey as String: [:] as [String: Any]
        ]

        var pool: CVPixelBufferPool?
        let status = CVPixelBufferPoolCreate(
            kCFAllocatorDefault,
            poolAttrs as CFDictionary,
            bufferAttrs as CFDictionary,
            &pool
        )
        guard status == kCVReturnSuccess, let createdPool = pool else { return nil }

        pixelBufferPool = createdPool
        poolWidth = width
        poolHeight = height
        return createdPool
    }

    private func createSampleBuffer(from pixelData: Data, width: Int, height: Int) -> CMSampleBuffer? {
        let bytesPerRow = pixelData.count / height

        guard let pool = getOrCreatePool(width: width, height: height) else { return nil }

        var pixelBuffer: CVPixelBuffer?
        let status = CVPixelBufferPoolCreatePixelBuffer(kCFAllocatorDefault, pool, &pixelBuffer)
        guard status == kCVReturnSuccess, let buffer = pixelBuffer else { return nil }

        CVPixelBufferLockBaseAddress(buffer, [])
        defer { CVPixelBufferUnlockBaseAddress(buffer, []) }

        guard let destBaseAddress = CVPixelBufferGetBaseAddress(buffer) else { return nil }
        let destBytesPerRow = CVPixelBufferGetBytesPerRow(buffer)

        // Copy row by row to handle bytesPerRow differences
        pixelData.withUnsafeBytes { srcRaw in
            guard let srcBase = srcRaw.baseAddress else { return }
            let copyBytesPerRow = min(bytesPerRow, destBytesPerRow)
            for row in 0..<height {
                let srcRow = srcBase.advanced(by: row * bytesPerRow)
                let dstRow = destBaseAddress.advanced(by: row * destBytesPerRow)
                memcpy(dstRow, srcRow, copyBytesPerRow)
            }
        }

        // Create CMSampleBuffer from pixel buffer
        var formatDescription: CMVideoFormatDescription?
        CMVideoFormatDescriptionCreateForImageBuffer(
            allocator: kCFAllocatorDefault,
            imageBuffer: buffer,
            formatDescriptionOut: &formatDescription
        )
        guard let desc = formatDescription else { return nil }

        var timingInfo = CMSampleTimingInfo(
            duration: CMTime.invalid,
            presentationTimeStamp: CMClockGetTime(CMClockGetHostTimeClock()),
            decodeTimeStamp: CMTime.invalid
        )

        var sampleBuffer: CMSampleBuffer?
        CMSampleBufferCreateReadyWithImageBuffer(
            allocator: kCFAllocatorDefault,
            imageBuffer: buffer,
            formatDescription: desc,
            sampleTiming: &timingInfo,
            sampleBufferOut: &sampleBuffer
        )

        return sampleBuffer
    }
}
