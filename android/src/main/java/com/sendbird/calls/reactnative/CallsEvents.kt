package com.sendbird.calls.reactnative

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.sendbird.calls.reactnative.module.CallsModule
import com.sendbird.calls.reactnative.utils.CallsUtils

fun defaultType(type: String): String {
    return "${CallsEvents.EVENT_DEFAULT}.${type}"
}
fun directCallType(type: String): String {
    return "${CallsEvents.EVENT_DIRECT_CALL}.${type}"
}

class CallsEvents {
    companion object {
//        private var jsReady = false
//        private var eventQueue = listOf<Map<String, Any>>()

        /**
         * Event
         * EVENT_{EVENT}
         * */
        const val EVENT_DEFAULT = "sendbird.call.default"
        const val EVENT_DIRECT_CALL = "sendbird.call.direct"

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

//        private fun storeEvent(reactContext: ReactContext, event: String, eventType: String, data: WritableMap, additionalData: Any?) {
//            Log.d(CallsModule.NAME, "[CallsEvents] storeEvent() $event-$eventType")
//            eventQueue.plus(mapOf(
//                "reactContext" to reactContext,
//                "event" to event,
//                "eventType" to eventType,
//                "data" to data,
//                "additionalData" to additionalData
//            ))
//        }

//        private fun flushEvents() {
//            Log.d(CallsModule.NAME, "[CallsEvents] flushEvents()")
//            eventQueue.forEach {
//                val context = it["reactContext"] as ReactContext
//                val event = it["event"] as String
//                val eventType = it["eventType"] as String
//                val data = it["data"] as WritableMap
//                val additionalData = it["additionalData"] as Any
//
//                sendEvent(context, event, eventType, data, additionalData)
//            }
//            eventQueue = listOf()
//        }

//        fun setJSReady(){
//            jsReady = true
//            flushEvents()
//        }
//
//        fun invalidate() {
//            eventQueue = listOf()
//            jsReady = false
//        }

        fun sendEvent(reactContext: ReactContext, event: String, eventType: String, data: WritableMap) {
//            if(!jsReady) {
//                storeEvent(reactContext, event, eventType, data, null)
//                return
//            }

            Log.d(CallsModule.NAME, "[CallsEvents] sendEvent() $event++$eventType")

            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(event, Arguments.createMap().apply {
                    putString("eventType", eventType)
                    putMap("data", data)
                })
        }

        fun sendEvent(reactContext: ReactContext, event: String, eventType: String, data: WritableMap, additionalData: Any) {
//            if(!jsReady) {
//                storeEvent(reactContext, event, eventType, data, additionalData)
//                return
//            }

            Log.d(CallsModule.NAME, "[CallsEvents] sendEvent() $event++$eventType")

            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(event, Arguments.createMap().apply {
                    putString("eventType", eventType)
                    putMap("data", data)
                    CallsUtils.insertMap(this, "additionalData", additionalData)
                })
        }
    }
}