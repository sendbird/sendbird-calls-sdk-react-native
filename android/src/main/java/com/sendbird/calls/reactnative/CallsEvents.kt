package com.sendbird.calls.reactnative

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

fun defaultType(type: String): String {
    return "${CallsEvents.EVENT_DEFAULT}.${type}"
}
fun directCallType(type: String): String {
    return "${CallsEvents.EVENT_DIRECT_CALL}.${type}"
}

class CallsEvents {
    companion object {
        /**
         * Event
         * EVENT_{EVENT}
         * */
        const val EVENT_DEFAULT = "sendbird.call"
        const val EVENT_DIRECT_CALL = "${EVENT_DEFAULT}.direct"

        /**
         * Event Type
         * TYPE_{EVENT}_{TYPE}
         * */
        val TYPE_DEFAULT_ON_RINGING = defaultType("onRinging")
        val TYPE_DIRECT_CALL_ON_ESTABLISHED = directCallType("onEstablished")
        val TYPE_DIRECT_CALL_ON_CONNECTED = directCallType("onConnected")
        val TYPE_DIRECT_CALL_ON_RECONNECTING = directCallType("onReconnecting")
        val TYPE_DIRECT_CALL_ON_RECONNECTED = directCallType("onReconnected")
        val TYPE_DIRECT_CALL_ON_ENDED = directCallType("onEnded")
        val TYPE_DIRECT_CALL_ON_REMOTE_AUDIO_SETTINGS_CHANGED = directCallType("onRemoteAudioSettingsChanged")
        val TYPE_DIRECT_CALL_ON_REMOTE_VIDEO_SETTINGS_CHANGED = directCallType("onRemoteVideoSettingsChanged")
        val TYPE_DIRECT_CALL_ON_LOCAL_VIDEO_SETTINGS_CHANGED = directCallType("onLocalVideoSettingsChanged")
        val TYPE_DIRECT_CALL_ON_REMOTE_RECORDING_STATUS_CHANGED = directCallType("onRemoteRecordingStatusChanged")
        val TYPE_DIRECT_CALL_ON_AUDIO_DEVICE_CHANGED = directCallType("onAudioDeviceChanged")
        val TYPE_DIRECT_CALL_ON_CUSTOM_ITEMS_UPDATED = directCallType("onCustomItemsUpdated")
        val TYPE_DIRECT_CALL_ON_CUSTOM_ITEMS_DELETED = directCallType("onCustomItemsDeleted")
        val TYPE_DIRECT_CALL_ON_USER_HOLD_STATUS_CHANGED = directCallType("onUserHoldStatusChanged")


        fun sendEvent(reactContext: ReactContext, event: String, eventType: String, data: WritableMap) {
            // val data = Arguments.createMap().apply {
            //     putString("eventProperty", "someValue")
            // }
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(event, Arguments.createMap().apply {
                    putString("eventType", eventType)
                    putMap("data", data)
                })
        }
    }
}