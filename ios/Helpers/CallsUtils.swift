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
    
    static func findViewBy(_ bridge: RCTBridge, _ tag: NSNumber) -> BaseVideoView {
        return bridge.uiManager.view(forReactTag: tag) as! BaseVideoView
    }
}
