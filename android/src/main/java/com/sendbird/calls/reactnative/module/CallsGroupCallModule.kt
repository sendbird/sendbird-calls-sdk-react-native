package com.sendbird.calls.reactnative.module

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.sendbird.calls.*

class CallsGroupCallModule(private val reactContext: ReactApplicationContext): GroupCallModule, RoomListener {
    /** GroupCallMethods **/
    override fun enter(roomId: String, promise: Promise) {
        TODO("Not yet implemented")
    }

    /** RoomListeners **/
    override fun onDeleted() {
        TODO("Not yet implemented")
    }

    override fun onError(e: SendBirdException, participant: Participant?) {
        TODO("Not yet implemented")
    }

    override fun onRemoteParticipantEntered(participant: RemoteParticipant) {
        TODO("Not yet implemented")
    }

    override fun onRemoteParticipantExited(participant: RemoteParticipant) {
        TODO("Not yet implemented")
    }

    override fun onRemoteParticipantStreamStarted(participant: RemoteParticipant) {
        TODO("Not yet implemented")
    }

    override fun onAudioDeviceChanged(currentAudioDevice: AudioDevice?, availableAudioDevices: Set<AudioDevice>) {
        TODO("Not yet implemented")
    }

    override fun onRemoteVideoSettingsChanged(participant: RemoteParticipant) {
        TODO("Not yet implemented")
    }

    override fun onRemoteAudioSettingsChanged(participant: RemoteParticipant) {
        TODO("Not yet implemented")
    }

    override fun onCustomItemsUpdated(updatedKeys: List<String>) {
        TODO("Not yet implemented")
    }

    override fun onCustomItemsDeleted(deletedKeys: List<String>) {
        TODO("Not yet implemented")
    }
}
