package com.sendbird.calls.reactnative.module

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.sendbird.calls.*
import com.sendbird.calls.reactnative.RNCallsInternalError
import com.sendbird.calls.reactnative.extension.rejectCalls
import com.sendbird.calls.reactnative.utils.CallsUtils

class CallsGroupCallModule: GroupCallModule {
    override fun enter(roomId: String, options: ReadableMap, promise: Promise) {
        val from = "groupCall/enter"
        Log.d(CallsModule.NAME, "[GroupCallModule] ${from} -> roomId($roomId) options(${options.toHashMap()})")
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
        Log.d(CallsModule.NAME, "[GroupCallModule] $from -> roomId($roomId)")
        CallsUtils.safeRun {
            CallsUtils.findRoom(roomId, from).exit()
        }
    }
}
