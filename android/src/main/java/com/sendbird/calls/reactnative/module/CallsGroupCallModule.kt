package com.sendbird.calls.reactnative.module

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.sendbird.calls.*
import com.sendbird.calls.reactnative.CallsEvents
import com.sendbird.calls.reactnative.RNCallsInternalError
import com.sendbird.calls.reactnative.utils.CallsUtils

class CallsGroupCallModule(private val reactContext: ReactApplicationContext): GroupCallModule, RoomListener {
    /** GroupCallMethods **/
    override fun enter(roomId: String, options: ReadableMap, promise: Promise) {
        Log.d(CallsModule.NAME, "[GroupCallModule] enter($roomId)")
        val from = "groupCall/enter"
        CallsUtils.safePromiseRejection(promise, from) {
            val room = SendBirdCall.getCachedRoomById(roomId)

            Log.d(CallsModule.NAME, "[GroupCallModule] enter options -> ${options.toHashMap()}")

            if (room == null) throw RNCallsInternalError(from, RNCallsInternalError.Type.NOT_FOUND_ROOM)
            else {
                val audioEnabled = options.getBoolean("audioEnabled")
                val videoEnabled = options.getBoolean("videoEnabled")

                val enterParams = EnterParams().apply {
                    setAudioEnabled(audioEnabled)
                    setVideoEnabled(videoEnabled)
                }
                room.enter(enterParams) { error: SendBirdException? ->
                    if (error != null) throw error
                    else promise.resolve(null)
                }
            }
        }
    }

    override fun exit(roomId: String) {
        val from = "groupCall/exit"
        Log.d(CallsModule.NAME, "[GroupCallModule] $from -> $roomId")
        CallsUtils.safeRun {
            val room = CallsUtils.findRoom(roomId, from)
            room.exit()
        }
    }

    /** RoomListeners **/
    override fun onDeleted() {
        TODO("Not yet implemented")
    }

    override fun onError(e: SendBirdException, participant: Participant?) {
        TODO("Not yet implemented")
    }

    override fun onRemoteParticipantEntered(participant: RemoteParticipant) {
        val from = "groupCall/onRemoteParticipantEntered"
        Log.d(CallsModule.NAME, "[GroupCallModule] $from")
        CallsUtils.safeRun {
            val participantJsMap = CallsUtils.convertParticipantToJsMap(participant)
            if (participantJsMap == null) throw RNCallsInternalError(from, RNCallsInternalError.Type.NOT_FOUND_PARTICIPANT)
            else {
                CallsEvents.sendEvent(
                    reactContext,
                    CallsEvents.EVENT_GROUP_CALL,
                    CallsEvents.TYPE_GROUP_CALL_ON_REMOTE_PARTICIPANT_ENTERED,
                    participantJsMap,
                )
            }
        }
    }

    override fun onRemoteParticipantExited(participant: RemoteParticipant) {
        val from = "groupCall/onRemoteParticipantExited"
        Log.d(CallsModule.NAME, "[GroupCallModule] $from")
        CallsUtils.safeRun {
            val participantJsMap = CallsUtils.convertParticipantToJsMap(participant)
            if (participantJsMap == null) throw RNCallsInternalError(from, RNCallsInternalError.Type.NOT_FOUND_PARTICIPANT)
            else {
                CallsEvents.sendEvent(
                    reactContext,
                    CallsEvents.EVENT_GROUP_CALL,
                    CallsEvents.TYPE_GROUP_CALL_ON_REMOTE_PARTICIPANT_EXITED,
                    participantJsMap,
                )
            }
        }
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
