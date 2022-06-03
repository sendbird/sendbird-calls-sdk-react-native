//
//  CallsModule+DirectCall.swift
//  RNSendbirdCalls
//
//  Created by Airen Kang on 2022/05/06.
//  Copyright © 2022 Sendbird. All rights reserved.
//

import Foundation
import SendBirdCalls
import CallKit
import AVFoundation

protocol CallsDirectCallModuleProtocol {
    func selectVideoDevice(callId: String, device: String, promise: Promise)
    func accept(callId: String, options: [String: Any?], holdActiveCall: Bool, promise: Promise)
    func end(callId: String, promise: Promise)
    func switchCamera(callId: String, promise: Promise)
    func startVideo(callId: String)
    func stopVideo(callId: String)
    func muteMicrophone(callId: String)
    func unmuteMicrophone(callId: String)
    func updateLocalVideoView(callId: String, videoViewId: NSNumber)
    func updateRemoteVideoView(callId: String, videoViewId: NSNumber)
}

// MARK: DirectCallMethods
class CallsDirectCallModule: NSObject, CallsDirectCallModuleProtocol {
    func selectVideoDevice(callId: String, device: String, promise: Promise) {
        let from = "directCall/accept"
        if let directCall = try? CallsUtils.findDirectCallBy(callId) {
            if let videoDevice = directCall.availableVideoDevices.first(where: { $0.uniqueId == device }) {
                directCall.selectVideoDevice(videoDevice) { error in
                    if let error = error {
                        promise.reject(error)
                    } else {
                        promise.resolve()
                    }
                }
            } else {
                promise.reject(RNCallsInternalError.notFoundVideoDevice(from))
            }
        } else {
            promise.reject(RNCallsInternalError.notFoundDirectCall(from))
        }
    }
    
    func accept(callId: String, options: [String : Any], holdActiveCall: Bool, promise: Promise) {
        if let directCall = try? CallsUtils.findDirectCallBy(callId) {
            directCall.end {
                promise.resolve()
            }
        } else {
            promise.reject(RNCallsInternalError.notFoundDirectCall("directCall/accept"))
        }
    }
    
    func accept(callId: String, options: [String : Any?], holdActiveCall: Bool, promise: Promise) {
        if let directCall = try? CallsUtils.findDirectCallBy(callId) {
            let callOptions = CallsUtils.convertDictToCallOptions(options)
            let acceptParams = AcceptParams(callOptions: callOptions, holdActiveCall: holdActiveCall)
            
            directCall.accept(with: acceptParams)
            promise.resolve()
        } else {
            promise.reject(RNCallsInternalError.notFoundDirectCall("directCall/accept"))
        }
    }
    
    func end(callId: String, promise: Promise) {
        if let directCall = try? CallsUtils.findDirectCallBy(callId) {
            directCall.end {
                promise.resolve()
            }
        } else {
            promise.reject(RNCallsInternalError.notFoundDirectCall("directCall/accept"))
        }
    }
    
    func switchCamera(callId: String, promise: Promise) {
        if let directCall = try? CallsUtils.findDirectCallBy(callId) {
            directCall.switchCamera { error in
                if let error = error {
                    promise.reject(error)
                } else {
                    promise.resolve()
                }
            }
        } else {
            promise.reject(RNCallsInternalError.notFoundDirectCall("directCall/accept"))
        }
    }
    
    func startVideo(callId: String) {
        CallsUtils.safeRun {
            let directCall = try CallsUtils.findDirectCallBy(callId)
            directCall.startVideo()
        }
    }
    
    func stopVideo(callId: String) {
        CallsUtils.safeRun {
            let directCall = try CallsUtils.findDirectCallBy(callId)
            directCall.stopVideo()
        }
    }
    
    func muteMicrophone(callId: String) {
        CallsUtils.safeRun {
            let directCall = try CallsUtils.findDirectCallBy(callId)
            directCall.muteMicrophone()
        }
    }
    
    func unmuteMicrophone(callId: String) {
        CallsUtils.safeRun {
            let directCall = try CallsUtils.findDirectCallBy(callId)
            directCall.unmuteMicrophone()
        }
    }
    
    func updateLocalVideoView(callId: String, videoViewId: NSNumber) {
        CallsUtils.safeRun {
            let directCall = try CallsUtils.findDirectCallBy(callId)
            let videoView = try CallsUtils.findViewBy(RNSendbirdCalls.shared.bridge, videoViewId)
            directCall.updateLocalVideoView(videoView.surface)
        }
    }
    
    func updateRemoteVideoView(callId: String, videoViewId: NSNumber) {
        CallsUtils.safeRun {
            let directCall = try CallsUtils.findDirectCallBy(callId)
            let videoView = try CallsUtils.findViewBy(RNSendbirdCalls.shared.bridge, videoViewId)
            directCall.updateRemoteVideoView(videoView.surface)
        }
    }
}

// MARK: DirectCallDelegate
extension CallsDirectCallModule: DirectCallDelegate {
    func didAudioDeviceChange(_ call: DirectCall, session: AVAudioSession, previousRoute: AVAudioSessionRouteDescription, reason: AVAudioSession.RouteChangeReason) {
        CallsEvents.shared.sendEvent(.directCall(.onAudioDeviceChanged),
                                     CallsUtils.convertDirectCallToDict(call),
                                     [
                                        "reason": reason.rawValue,
                                        "currentRoute": CallsUtils.convertAVRouteToDict(session.currentRoute),
                                        "previousRoute": CallsUtils.convertAVRouteToDict(previousRoute)
                                     ])
    }
    
    func didConnect(_ call: DirectCall) {
        CallsEvents.shared.sendEvent(.directCall(.onConnected),
                                     CallsUtils.convertDirectCallToDict(call))
    }
    
    func didDeleteCustomItems(call: DirectCall, deletedKeys: [String]) {
        CallsEvents.shared.sendEvent(.directCall(.onCustomItemsDeleted),
                                     CallsUtils.convertDirectCallToDict(call),
                                     deletedKeys)
    }
    
    func didUpdateCustomItems(call: DirectCall, updatedKeys: [String]) {
        CallsEvents.shared.sendEvent(.directCall(.onCustomItemsUpdated),
                                     CallsUtils.convertDirectCallToDict(call),
                                     updatedKeys)
    }
    
    func didEnd(_ call: DirectCall) {
        // TODO: Extaract to @sendbird/calls-react-native-voip
        // TODO: voip call end
        //  if let callUUID = call.callUUID {
        //      CXCallManager.shared.endCall(for: callUUID, endedAt: Date(), reason: call.endResult)
        //  }
        CallsEvents.shared.sendEvent(.directCall(.onEnded),
                                     CallsUtils.convertDirectCallToDict(call))
    }
    
    func didEstablish(_ call: DirectCall) {
        CallsEvents.shared.sendEvent(.directCall(.onEstablished),
                                     CallsUtils.convertDirectCallToDict(call))
    }
    
    // func didLocalVideoSettingsChange - Not implemented in iOS
    
    func didReconnect(_ call: DirectCall) {
        CallsEvents.shared.sendEvent(.directCall(.onReconnected),
                                     CallsUtils.convertDirectCallToDict(call))
    }
    
    func didStartReconnecting(_ call: DirectCall) {
        CallsEvents.shared.sendEvent(.directCall(.onReconnecting),
                                     CallsUtils.convertDirectCallToDict(call))
    }
    
    func didRemoteAudioSettingsChange(_ call: DirectCall) {
        CallsEvents.shared.sendEvent(.directCall(.onRemoteAudioSettingsChanged),
                                     CallsUtils.convertDirectCallToDict(call))
    }
    
    func didRemoteRecordingStatusChange(_ call: DirectCall) {
        CallsEvents.shared.sendEvent(.directCall(.onRemoteRecordingStatusChanged),
                                     CallsUtils.convertDirectCallToDict(call))
    }
    
    func didRemoteVideoSettingsChange(_ call: DirectCall) {
        CallsEvents.shared.sendEvent(.directCall(.onRemoteVideoSettingsChanged),
                                     CallsUtils.convertDirectCallToDict(call))
    }
    
    func didUserHoldStatusChange(_ call: DirectCall, isLocalUser: Bool, isUserOnHold: Bool) {
        CallsEvents.shared.sendEvent(.directCall(.onUserHoldStatusChanged),
                                     CallsUtils.convertDirectCallToDict(call),
                                     [
                                        "isLocalUser": isLocalUser,
                                        "isUserOnHold": isUserOnHold
                                     ])
    }
}
