//
//  ScreenShareManager.swift
//  RNSendbirdCalls
//
//  Copyright © 2022 Sendbird. All rights reserved.
//

import Foundation
import SendBirdCalls
import ReplayKit

class ScreenShareManager {
    private var promise: Promise?

    // Error codes from SendbirdError.ts not available in SBCError.ErrorCode
    private static let errScreenShareFailedDueToUnknownReason = 1800626
    private static let errPermissionDeniedForScreenShare = 1800628

    func start(
        _ promise: Promise,
        connect: @escaping (@escaping (((CMSampleBuffer, Error?) -> Void)?, SBCError?) -> Void) -> Void,
        disconnect: @escaping () -> Void
    ) {
        let from = "directCall/startScreenShare"

        if self.promise != nil {
            return promise.reject(code: SBCError.ErrorCode.screenShareAlreadyInProgress.rawValue,
                                  message: "[\(from)] Screen share is already in progress")
        }

        self.promise = promise

        connect { [weak self] bufferHandler, error in
            guard let self = self else { return }

            if let error = error {
                self.promise = nil
                self.stopCapture()
                promise.reject(error)
                return
            }

            guard let bufferHandler = bufferHandler else {
                self.promise = nil
                self.stopCapture()
                promise.reject(code: Self.errScreenShareFailedDueToUnknownReason,
                               message: "[\(from)] Failed to start screen share")
                return
            }

            self.startCapture(bufferHandler: bufferHandler) { captureError in
                if let captureError = captureError {
                    disconnect()
                    self.promise = nil
                    self.stopCapture()
                    promise.reject(code: captureError.code, message: captureError.message)
                } else {
                    self.promise = nil
                    promise.resolve()
                }
            }
        }
    }

    func stopCapture(completion: (() -> Void)? = nil) {
        guard RPScreenRecorder.shared().isRecording else {
            completion?()
            return
        }
        RPScreenRecorder.shared().stopCapture { _ in
            completion?()
        }
    }

    func cleanup() {
        promise?.reject(code: Self.errScreenShareFailedDueToUnknownReason,
                        message: "Screen share was cancelled")
        promise = nil
        stopCapture()
    }

    // MARK: - Private

    private struct CaptureError {
        let code: Int
        let message: String
    }

    private func startCapture(
        bufferHandler: @escaping (CMSampleBuffer, Error?) -> Void,
        completion: @escaping (CaptureError?) -> Void
    ) {
        let from = "directCall/startScreenShare"

        RPScreenRecorder.shared().startCapture { sampleBuffer, bufferType, captureError in
            if bufferType == .video {
                bufferHandler(sampleBuffer, captureError)
            }
        } completionHandler: { captureError in
            guard let captureError = captureError else {
                completion(nil)
                return
            }

            let nsError = captureError as NSError
            if nsError.domain == RPRecordingErrorDomain && nsError.code == RPRecordingErrorCode.userDeclined.rawValue {
                completion(CaptureError(code: Self.errPermissionDeniedForScreenShare,
                                        message: "[\(from)] User denied screen share permission"))
            } else {
                completion(CaptureError(code: Self.errScreenShareFailedDueToUnknownReason,
                                        message: "[\(from)] Failed to start screen share"))
            }
        }
    }
}
