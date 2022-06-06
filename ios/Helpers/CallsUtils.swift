//
//  CallsUtils.swift
//  RNSendbirdCalls
//
//  Created by Airen Kang on 2022/05/03.
//  Copyright © 2022 Sendbird. All rights reserved.
//

import Foundation
import SendBirdCalls
import React
import AVFoundation

// MARK: Converter
class CallsUtils {
    static func convertUserToDict(_ user: SendBirdCalls.User) -> [String: Any?] {
        return [
            "userId": user.userId,
            "isActive": user.isActive,
            "nickname": user.nickname ?? "",
            "metaData": user.metadata ?? [:],
            "profileUrl": user.profileURL ?? ""
        ]
    }
    
    static func convertDirectCallToDict(_ call: DirectCall) -> [String: Any?] {
        return [
            "callId": call.callId,
            "callLog": convertDirectCallLogToDict(call.callLog),
            "callee": convertDirectCallUserToDict(call.callee),
            "caller": convertDirectCallUserToDict(call.caller),
            "endedBy": convertDirectCallUserToDict(call.endedBy),
            "customItems": call.customItems,
            "duration": call.duration,
            "endResult": call.endResult.asString,
            "localUser": convertDirectCallUserToDict(call.localUser),
            "remoteUser": convertDirectCallUserToDict(call.remoteUser),
            "myRole": call.myRole.asString,
            "availableVideoDevices": call.availableVideoDevices.map { convertVideoDeviceToDict(device: $0) },
            "currentVideoDevice": convertVideoDeviceToDict(device: call.currentVideoDevice),
            "isEnded": call.isEnded,
            "isOnHold": call.isOnHold,
            "isOngoing": call.isOngoing,
            "isVideoCall": call.isVideoCall,
            "isLocalScreenShareEnabled": call.isLocalScreenShareEnabled,
            "isLocalAudioEnabled": call.isLocalAudioEnabled,
            "isLocalVideoEnabled": call.isLocalVideoEnabled,
            "isRemoteAudioEnabled": call.isRemoteAudioEnabled,
            "isRemoteVideoEnabled": call.isRemoteVideoEnabled,
            "localRecordingStatus": call.localRecordingStatus.asString,
            "remoteRecordingStatus": call.remoteRecordingStatus.asString,
            
        ]
    }
    
    static func convertDirectCallLogToDict(_ callLog: DirectCallLog?) -> [String: Any?]? {
        guard let callLog = callLog else {
            return nil
        }
        
        return [
            "startedAt": callLog.startedAt,
            "endedAt": callLog.endedAt,
            "duration": callLog.duration,
            "callId": callLog.callId,
            "isFromServer": callLog.isFromServer,
            "isVideoCall": callLog.isVideoCall,
            "customItems": callLog.customItems,
            "endResult": callLog.endResult.asString,
            "myRole": callLog.myRole.asString,
            "callee": convertDirectCallUserToDict(callLog.callee),
            "caller": convertDirectCallUserToDict(callLog.caller),
            "endedBy": convertDirectCallUserToDict(callLog.endedBy),
        ]
    }
    
    static func convertDirectCallUserToDict(_ callUser: DirectCallUser?) -> [String: Any?]? {
        guard let callUser = callUser else {
            return nil
        }
        
        var user = convertUserToDict(callUser)
        user["role"] = callUser.role.asString
        return user
    }
    
    static func convertVideoDeviceToDict(device: VideoDevice?) -> [String: String]? {
        guard let device = device else {
            return nil
        }
        
        return [
            "deviceId": device.uniqueId,
            "position": device.position.asString
        ]
    }
    
    static func convertDictToCallOptions(_ options: [String: Any?]) -> CallOptions {
        let callOptions = CallOptions()
        
        if let audioEnabled = options["audioEnabled"] as? Bool {
            callOptions.isAudioEnabled = audioEnabled
        }
        if let videoEnabled = options["videoEnabled"] as? Bool {
            callOptions.isVideoEnabled = videoEnabled
        }
        if let frontCamera = options["frontCamera"] as? Bool {
            callOptions.useFrontCamera = frontCamera
        }
        if let localVideoViewId = options["localVideoViewId"] as? NSNumber {
            callOptions.localVideoView = safeGet {
                try CallsUtils.findViewBy(CallsEvents.shared.bridge, localVideoViewId).surface
            }
        }
        if let remoteVideoViewId = options["remoteVideoViewId"] as? NSNumber {
            callOptions.remoteVideoView = safeGet {
                try CallsUtils.findViewBy(CallsEvents.shared.bridge, remoteVideoViewId).surface
            }
        }
        
        return callOptions
    }
    
    static func convertAVRouteToDict(_ route: AVAudioSessionRouteDescription) -> [String: [[String: String]]] {
        return [
            "inputs": route.inputs.map {
                [
                    "portName": $0.portName,
                    "portType": $0.portType.rawValue
                ]
            },
            "outputs": route.outputs.map {
                [
                    "portName": $0.portName,
                    "portType": $0.portType.rawValue
                ]
            }
        ]
    }
}

// MARK: Safe runner block
extension CallsUtils {
    static func safeRun(completion: () throws -> Void) {
        do {
            try completion()
        } catch { }
    }
    
    static func safeGet<T>(_ completion: () throws -> T) -> T? {
        do {
            return try completion()
        } catch {
            return nil
        }
    }
}

// MARK: Finder
extension CallsUtils {
    static func findDirectCallBy(_ callIdOrUUID: String) throws -> DirectCall {
        if let callFromId = SendBirdCall.getCall(forCallId: callIdOrUUID) {
            return callFromId
        } else if let callFromUUID = SendBirdCall.getCall(forUUID: UUID(uuidString: callIdOrUUID)!) {
            return callFromUUID
        }
        throw RNCallsInternalError.notFoundDirectCall("findDirectCallBy")
    }
    
    static func findViewBy(_ bridge: RCTBridge, _ tag: NSNumber) throws -> BaseVideoView {
        if let view = bridge.uiManager.view(forReactTag: tag) as? BaseVideoView {
            return view
        }
        throw RNCallsInternalError.notFoundVideoView("findViewBy")
    }
}
