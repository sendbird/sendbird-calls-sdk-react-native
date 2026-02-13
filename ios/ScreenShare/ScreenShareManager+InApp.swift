//
//  ScreenShareManager+InApp.swift
//  RNSendbirdCalls
//
//  Copyright © 2024 Sendbird. All rights reserved.
//

import Foundation
import SendBirdCalls
import ReplayKit

// MARK: - In-App Mode
extension ScreenShareManager {
    func startInApp(
        _ promise: Promise,
        ready: @escaping ReadyHandler,
        release: @escaping () -> Void,
        notifyStateChange: @escaping () -> Void
    ) {
        let from = "directCall/startScreenShare"

        if inAppPromise != nil {
            return promise.reject(code: SBCError.ErrorCode.screenShareAlreadyInProgress.rawValue,
                                  message: "[\(from)] Screen share is already in progress")
        }
        inAppPromise = promise

        ready { [weak self] bufferHandler, error in
            guard let self = self else { return }

            if let error = error {
                self.inAppPromise = nil
                promise.reject(error)
                return
            }

            guard let bufferHandler = bufferHandler else {
                self.inAppPromise = nil
                promise.reject(code: Self.errScreenShareFailedDueToUnknownReason,
                               message: "[\(from)] Failed to start screen share")
                return
            }

            self.startCapture(from: from, bufferHandler: bufferHandler) { captureError in
                if let captureError = captureError {
                    release()
                    self.inAppPromise = nil
                    self.stopCapture()
                    promise.reject(code: captureError.code, message: captureError.message)
                } else {
                    self.inAppPromise = nil
                    promise.resolve()
                    notifyStateChange()
                }
            }
        }
    }

    func stopInApp(
        _ promise: Promise,
        release: ((@escaping (SBCError?) -> Void) -> Void)?,
        notifyStateChange: (() -> Void)?
    ) {
        guard let release = release else {
            cleanupInApp()
            promise.resolve()
            return
        }

        release { [weak self] error in
            self?.cleanupInApp()
            if let error = error {
                promise.reject(error)
            } else {
                promise.resolve()
                notifyStateChange?()
            }
        }
    }

    func cleanupInApp() {
        inAppPromise?.reject(code: Self.errScreenShareFailedDueToUnknownReason,
                             message: "Screen share was cancelled")
        inAppPromise = nil
        stopCapture()
    }

    // MARK: - RPScreenRecorder Capture
    private struct CaptureError {
        let code: Int
        let message: String
    }

    private func startCapture(
        from: String,
        bufferHandler: @escaping (CMSampleBuffer, Error?) -> Void,
        completion: @escaping (CaptureError?) -> Void
    ) {
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

    private func stopCapture(completion: (() -> Void)? = nil) {
        guard RPScreenRecorder.shared().isRecording else {
            completion?()
            return
        }
        RPScreenRecorder.shared().stopCapture { _ in
            completion?()
        }
    }
}
