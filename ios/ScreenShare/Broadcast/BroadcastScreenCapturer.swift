//
//  BroadcastScreenCapturer.swift
//  sendbird-calls-react-native
//
//  Copyright © 2024 Sendbird. All rights reserved.
//

import Foundation
import ReplayKit
import CoreVideo
import CoreMedia

class BroadcastScreenCapturer {
    private var socketServer: SocketServer?
    private var bufferHandler: ((CMSampleBuffer, Error?) -> Void)?
    private var isCapturing = false
    private var pixelBufferPool: CVPixelBufferPool?
    private var poolWidth: Int = 0
    private var poolHeight: Int = 0
    private var connectionTimeoutWork: DispatchWorkItem?
    private var startCompletion: ((Error?) -> Void)?

    /// Timeout waiting for the broadcast extension to connect after picker is shown.
    /// The user must select the extension in the picker within this duration.
    private static let connectionTimeoutSeconds: TimeInterval = 30

    func start(
        appGroupIdentifier: String,
        extensionBundleIdentifier: String?,
        bufferHandler: @escaping (CMSampleBuffer, Error?) -> Void,
        completion: @escaping (Error?) -> Void
    ) {
        guard !isCapturing else {
            completion(nil)
            return
        }

        self.bufferHandler = bufferHandler
        self.startCompletion = completion
        isCapturing = true

        guard let server = SocketServer(appGroupIdentifier: appGroupIdentifier) else {
            isCapturing = false
            startCompletion = nil
            let error = NSError(
                domain: "com.sendbird.calls.broadcast",
                code: -3,
                userInfo: [NSLocalizedDescriptionKey: "Invalid App Group identifier. Cannot access shared container."]
            )
            completion(error)
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

        guard server.start() else {
            isCapturing = false
            startCompletion = nil
            let error = NSError(
                domain: "com.sendbird.calls.broadcast",
                code: -1,
                userInfo: [NSLocalizedDescriptionKey: "Failed to start socket server"]
            )
            completion(error)
            return
        }

        socketServer = server

        // Start timeout — if the extension doesn't connect within the timeout,
        // assume the user dismissed the picker without selecting.
        let timeoutWork = DispatchWorkItem { [weak self] in
            self?.handleConnectionTimeout()
        }
        connectionTimeoutWork = timeoutWork
        DispatchQueue.main.asyncAfter(
            deadline: .now() + Self.connectionTimeoutSeconds,
            execute: timeoutWork
        )

        // Trigger the system broadcast picker
        showBroadcastPicker(extensionBundleIdentifier: extensionBundleIdentifier)
    }

    func stop(completion: (() -> Void)? = nil) {
        isCapturing = false
        bufferHandler = nil
        connectionTimeoutWork?.cancel()
        connectionTimeoutWork = nil
        socketServer?.stop()
        socketServer = nil
        pixelBufferPool = nil
        poolWidth = 0
        poolHeight = 0

        // If stop is called before the extension connected, reject the pending start
        if let pending = startCompletion {
            startCompletion = nil
            let error = NSError(
                domain: "com.sendbird.calls.broadcast",
                code: -4,
                userInfo: [NSLocalizedDescriptionKey: "Screen share was cancelled"]
            )
            pending(error)
        }

        completion?()
    }

    // MARK: - Private

    private func handleClientConnected() {
        connectionTimeoutWork?.cancel()
        connectionTimeoutWork = nil

        let pending = startCompletion
        startCompletion = nil
        pending?(nil)
    }

    private func handleConnectionTimeout() {
        connectionTimeoutWork = nil

        guard startCompletion != nil else { return }

        // Extension never connected — user dismissed the picker without selecting
        stop()
    }

    private func showBroadcastPicker(extensionBundleIdentifier: String?) {
        DispatchQueue.main.async {
            let pickerView = RPSystemBroadcastPickerView(frame: CGRect(x: 0, y: 0, width: 1, height: 1))
            pickerView.showsMicrophoneButton = false
            if let extensionId = extensionBundleIdentifier {
                pickerView.preferredExtension = extensionId
            }

            // Find and trigger the button inside the picker
            for subview in pickerView.subviews {
                if let button = subview as? UIButton {
                    button.sendActions(for: .touchUpInside)
                    break
                }
            }
        }
    }

    private func handleReceivedFrame(pixelData: Data, width: UInt32, height: UInt32) {
        guard isCapturing, let handler = bufferHandler else { return }

        guard let sampleBuffer = createSampleBuffer(from: pixelData, width: Int(width), height: Int(height)) else {
            return
        }

        handler(sampleBuffer, nil)
    }

    private func handleClientDisconnected() {
        guard isCapturing else { return }
        stop()
    }

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
