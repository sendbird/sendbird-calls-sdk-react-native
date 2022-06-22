package com.sendbird.calls.reactnative.module

import android.util.Log
import com.facebook.react.bridge.Promise
import com.sendbird.calls.reactnative.extension.rejectCalls
import com.sendbird.calls.reactnative.utils.CallsUtils

class CallsLocalParticipantModule: LocalParticipantModule {
    private fun errorMessage(roomId: String): String {
        return "roomId($roomId) has no localParticipant"
    }

    override fun localMuteMicrophone(roomId: String) {
        val from = "localParticipant/muteMicrophone"
        Log.d(CallsModule.NAME, "[LocalParticipantModule] $from")
        CallsUtils.safeRun {
            CallsUtils.findRoom(roomId, from).localParticipant?.muteMicrophone()
        }
    }

    override fun localUnmuteMicrophone(roomId: String) {
        val from = "localParticipant/unmuteMicrophone"
        Log.d(CallsModule.NAME, "[LocalParticipantModule] $from")
        CallsUtils.safeRun {
            CallsUtils.findRoom(roomId, from).localParticipant?.unmuteMicrophone()
        }
    }

    override fun localStopVideo(roomId: String) {
        val from = "localParticipant/stopVideo"
        Log.d(CallsModule.NAME, "[LocalParticipantModule] $from")
        CallsUtils.safeRun {
            CallsUtils.findRoom(roomId, from).localParticipant?.stopVideo()
        }
    }

    override fun localStartVideo(roomId: String) {
        val from = "localParticipant/startVideo"
        Log.d(CallsModule.NAME, "[LocalParticipantModule] $from")
        CallsUtils.safeRun {
            CallsUtils.findRoom(roomId, from).localParticipant?.startVideo()
        }
    }

    override fun localSwitchCamera(roomId: String, promise: Promise) {
        val from = "localParticipant/switchCamera"
        Log.d(CallsModule.NAME, "[LocalParticipantModule] $from")
        CallsUtils.safeRun {
            CallsUtils.findRoom(roomId, from).localParticipant?.switchCamera { error ->
                error
                    ?.let {
                        promise.rejectCalls(it)
                    }
                    ?: run {
                        promise.resolve(null)
                    }
            }
        }
    }
}
