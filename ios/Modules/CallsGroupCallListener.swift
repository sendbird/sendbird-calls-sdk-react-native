//
//  RoomDelegate.swift
//  RNSendbirdCalls
//
//  Created by Beomjun Kim on 2022/07/05.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import SendBirdCalls
import AVFoundation

class CallsGroupCallListener: RoomDelegate {
    var room: Room
    
    init(_ room: Room) {
        self.room = room
    }
    
    func didDelete() {
        DispatchQueue.main.async {
            CallsEvents.shared.sendEvent(.groupCall(.onDeleted),
                                         CallsUtils.convertRoomToDict(self.room)!)
        }
    }
    
    func didReceiveError(_ error: SBCError, _ participant: Participant?) {
        DispatchQueue.main.async {
            CallsEvents.shared.sendEvent(.groupCall(.onError),
                                         CallsUtils.convertRoomToDict(self.room)!,
                                         [
                                            "participant": CallsUtils.convertParticipantToDict(participant),
                                            "errorCode": String(error.errorCode.rawValue),
                                            "errorMessage": error.localizedDescription
                                         ])
        }
    }
    
    func didRemoteParticipantEnter(_ participant: RemoteParticipant) {
        DispatchQueue.main.async {
            CallsEvents.shared.sendEvent(.groupCall(.onRemoteParticipantEntered),
                                         CallsUtils.convertRoomToDict(self.room)!,
                                         [
                                            "participant": CallsUtils.convertParticipantToDict(participant)
                                         ])
        }
    }
    
    func didRemoteParticipantExit(_ participant: RemoteParticipant) {
        DispatchQueue.main.async {
            CallsEvents.shared.sendEvent(.groupCall(.onRemoteParticipantExited),
                                         CallsUtils.convertRoomToDict(self.room)!,
                                         [
                                            "participant": CallsUtils.convertParticipantToDict(participant)
                                         ])
        }
    }
    
    func didRemoteParticipantStreamStart(_ participant: RemoteParticipant) {
        DispatchQueue.main.async {
            CallsEvents.shared.sendEvent(.groupCall(.onRemoteParticipantStreamStarted),
                                         CallsUtils.convertRoomToDict(self.room)!,
                                         [
                                            "participant": CallsUtils.convertParticipantToDict(participant)
                                         ])
        }
    }
       
    func didAudioDeviceChange(_ room: Room, session: AVAudioSession, previousRoute: AVAudioSessionRouteDescription, reason: AVAudioSession.RouteChangeReason) {
        DispatchQueue.main.async {
            CallsEvents.shared.sendEvent(.groupCall(.onAudioDeviceChanged),
                                         CallsUtils.convertRoomToDict(self.room)!,
                                         [
                                            "reason": reason.rawValue,
                                            "currentRoute": CallsUtils.convertAVRouteToDict(session.currentRoute),
                                            "previousRoute": CallsUtils.convertAVRouteToDict(previousRoute)
                                         ])
        }
    }
    
    func didRemoteVideoSettingsChange(_ participant: RemoteParticipant) {
        DispatchQueue.main.async {
            CallsEvents.shared.sendEvent(.groupCall(.onRemoteVideoSettingsChanged),
                                         CallsUtils.convertRoomToDict(self.room)!,
                                         [
                                            "participant": CallsUtils.convertParticipantToDict(participant)
                                         ])
        }
    }
    
    func didRemoteAudioSettingsChange(_ participant: RemoteParticipant) {
        DispatchQueue.main.async {
            CallsEvents.shared.sendEvent(.groupCall(.onRemoteAudioSettingsChanged),
                                         CallsUtils.convertRoomToDict(self.room)!,
                                         [
                                            "participant": CallsUtils.convertParticipantToDict(participant)
                                         ])
        }
    }
    
    func didCustomItemsUpdate(_ updatedKeys: [String]) {
        DispatchQueue.main.async {
            CallsEvents.shared.sendEvent(.groupCall(.onCustomItemsUpdated),
                                         CallsUtils.convertRoomToDict(self.room)!,
                                         [
                                            "updatedKeys": updatedKeys
                                         ])
        }
    }
    
    func didCustomItemsDelete(_ deletedKeys: [String]) {
        DispatchQueue.main.async {
            CallsEvents.shared.sendEvent(.groupCall(.onCustomItemsDeleted),
                                         CallsUtils.convertRoomToDict(self.room)!,
                                         [
                                            "deletedKeys": deletedKeys
                                         ])
        }
    }
}
