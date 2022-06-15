package com.sendbird.calls.reactnative.module

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.sendbird.calls.*
import com.sendbird.calls.reactnative.CallsEvents
import com.sendbird.calls.reactnative.RNCallsInternalError
import com.sendbird.calls.reactnative.extension.rejectCalls
import com.sendbird.calls.reactnative.utils.CallsUtils

class CallsGroupCallModule(private val root: CallsModule): GroupCallModule, RoomListener {
    /** GroupCallMethods **/
    override fun enter(roomId: String, options: ReadableMap, promise: Promise) {
        Log.d(CallsModule.NAME, "[GroupCallModule] enter($roomId)")
        Log.d(CallsModule.NAME, "[GroupCallModule] enter options -> ${options.toHashMap()}")

        val from = "groupCall/enter"
        SendBirdCall.getCachedRoomById(roomId)
            ?.let {
                val audioEnabled = CallsUtils.safeGet { options.getBoolean("audioEnabled") }
                val videoEnabled = CallsUtils.safeGet { options.getBoolean("videoEnabled") }

                val enterParams = EnterParams().apply {
                    audioEnabled?.let {
                        setAudioEnabled(it)
                    }
                    videoEnabled?.let {
                        setVideoEnabled(it)
                    }
                }

                it.enter(enterParams) { error ->
                    error
                        ?.let {
                            promise.rejectCalls(it)
                        }
                        ?: run {
                            promise.resolve(null)
                        }
                }
            }
            ?: run {
                promise.rejectCalls(RNCallsInternalError(from, RNCallsInternalError.Type.NOT_FOUND_ROOM))
            }
    }

    override fun exit(roomId: String) {
        val from = "groupCall/exit"
        Log.d(CallsModule.NAME, "[GroupCallModule] $from -> $roomId")
        CallsUtils.safeRun {
            CallsUtils.findRoom(roomId, from).exit()
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
        CallsUtils.convertParticipantToJsMap(participant)?.let {
            CallsEvents.sendEvent(
                root.reactContext,
                CallsEvents.EVENT_GROUP_CALL,
                CallsEvents.TYPE_GROUP_CALL_ON_REMOTE_PARTICIPANT_ENTERED,
                it,
            )
        }
    }

    override fun onRemoteParticipantExited(participant: RemoteParticipant) {
        val from = "groupCall/onRemoteParticipantExited"
        Log.d(CallsModule.NAME, "[GroupCallModule] $from")
        CallsUtils.convertParticipantToJsMap(participant)?.let {
            CallsEvents.sendEvent(
                root.reactContext,
                CallsEvents.EVENT_GROUP_CALL,
                CallsEvents.TYPE_GROUP_CALL_ON_REMOTE_PARTICIPANT_EXITED,
                it,
            )
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
