//
//  RNSBGroupCallVideoView.swift
//  RNSendbirdCalls
//
//  Created by James Kim on 2022/07/12.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import React
import SendBirdCalls

@objc(RNSBGroupCallVideoView)
class RNSBGroupCallVideoView: BaseVideoView {
    @objc var roomId: String? = nil
    @objc var participantId: String? = nil
    
    private func getRoom(id: String?) -> Room? {
        guard let roomId = roomId else { return nil }
        
        if let room = SendBirdCall.getCachedRoom(by: roomId) {
            return room
        }
                
        return nil
    }
    
    
    override func didSetProps(_ changedProps: [String]!) {
        super.didSetProps(changedProps)
        
        if changedProps.contains("roomId") {
            setRoomId()
        }
        if changedProps.contains("participantId") {
            setParticipantId()
        }
    }
    
    private func setRoomId() {
        guard let room = getRoom(id: self.roomId) else { return }
        guard let participant = room.participants.first(where: { $0.participantId == self.participantId }) else { return }
        participant.videoView = self.surface
    }
    
    private func setParticipantId() {
        guard let room = getRoom(id: self.roomId) else { return }
        guard let participant = room.participants.first(where: { $0.participantId == self.participantId }) else { return }
        participant.videoView = self.surface
    }
}
