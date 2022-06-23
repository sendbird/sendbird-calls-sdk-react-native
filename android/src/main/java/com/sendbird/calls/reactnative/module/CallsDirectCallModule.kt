package com.sendbird.calls.reactnative.module

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.sendbird.calls.AcceptParams
import com.sendbird.calls.AudioDevice
import com.sendbird.calls.CallOptions
import com.sendbird.calls.DirectCall
import com.sendbird.calls.handler.DirectCallListener
import com.sendbird.calls.reactnative.CallsEvents
import com.sendbird.calls.reactnative.RNCallsInternalError
import com.sendbird.calls.reactnative.extension.asString
import com.sendbird.calls.reactnative.extension.rejectCalls
import com.sendbird.calls.reactnative.utils.CallsUtils

class CallsDirectCallModule(private val root: CallsModule): DirectCallModule,
    DirectCallListener() {
    /** DirectCallMethods **/
    override fun selectVideoDevice(callId: String, device: ReadableMap, promise: Promise)  {
        CallsUtils.safeRun(promise) {
            val from = "directCall/selectVideoDevice"
            val call = CallsUtils.findDirectCall(callId, from)
            val deviceId = CallsUtils.safeGet { device.getString("deviceId") }

            call.availableVideoDevices
                .find {
                    it.deviceName === deviceId
                }
                ?.let {
                    call.selectVideoDevice(it) { error ->
                        error
                            ?.let {
                                promise.rejectCalls(error)
                            }
                            ?: run {
                                promise.resolve(null)
                            }
                    }
                }
                ?: run {
                    promise.reject(RNCallsInternalError(from, RNCallsInternalError.Type.NOT_FOUND_VIDEO_DEVICE))
                }
        }
    }

    override fun accept(callId: String, options: ReadableMap, holdActiveCall: Boolean, promise: Promise) {
        Log.d(CallsModule.NAME, "[DirectCallModule] accept() -> $callId")
        Log.d(CallsModule.NAME, "[DirectCallModule] accept options -> ${options.toHashMap()}")

        CallsUtils.safeRun(promise) {
            val from = "directCall/accept"
            val call = CallsUtils.findDirectCall(callId, from)

            val localVideoViewId = CallsUtils.safeGet { options.getInt("localVideoViewId") }
            val remoteVideoViewId = CallsUtils.safeGet { options.getInt("remoteVideoViewId") }

            val audioEnabled = CallsUtils.safeGet { options.getBoolean("audioEnabled") }
            val videoEnabled = CallsUtils.safeGet { options.getBoolean("videoEnabled") }
            val frontCamera = CallsUtils.safeGet { options.getBoolean("frontCamera") }

            val acceptParams = AcceptParams().apply {
                setHoldActiveCall(holdActiveCall)
                setCallOptions(CallOptions().apply {
                    localVideoViewId?.let {
                        val surface = CallsUtils.findVideoView(root.reactContext, it, from).getSurface()
                        setLocalVideoView(surface)
                    }
                    remoteVideoViewId?.let {
                        val surface = CallsUtils.findVideoView(root.reactContext, it, from).getSurface()
                        setRemoteVideoView(surface)
                    }
                    audioEnabled?.let {
                        setAudioEnabled(it)
                    }
                    videoEnabled?.let {
                        setVideoEnabled(it)
                    }
                    frontCamera?.let {
                        setFrontCameraAsDefault(it)
                    }
                })
            }
            call.accept(acceptParams)
            promise.resolve(null)
        }
    }

    override fun end(callId: String, promise: Promise) {
        Log.d(CallsModule.NAME, "[DirectCallModule] end() -> $callId")

        CallsUtils.safeRun(promise) {
            val from = "directCall/end"
            CallsUtils.findDirectCall(callId, from).end()
            promise.resolve(null)
        }
    }

    override fun updateLocalVideoView(callId: String, videoViewId: Int) {
        Log.d(CallsModule.NAME, "[DirectCallModule] updateLocalVideoView() -> $callId / $videoViewId")

        CallsUtils.safeRun {
            val from = "directCall/updateLocalVideoView"
            val call = CallsUtils.findDirectCall(callId, from)
            val view = CallsUtils.findVideoView(root.reactContext, videoViewId, from)
            call.setLocalVideoView(view.getSurface())
        }
    }

    override fun updateRemoteVideoView(callId: String, videoViewId: Int) {
        Log.d(CallsModule.NAME, "[DirectCallModule] updateRemoteVideoView() -> $callId / $videoViewId")

        CallsUtils.safeRun {
            val from = "directCall/updateRemoteVideoView"
            val call = CallsUtils.findDirectCall(callId, from)
            val view = CallsUtils.findVideoView(root.reactContext, videoViewId, from)
            call.setRemoteVideoView(view.getSurface())
        }
    }

    /** DirectCallListeners **/
    override fun onAudioDeviceChanged(
        call: DirectCall,
        currentAudioDevice: AudioDevice?,
        availableAudioDevices: MutableSet<AudioDevice>
    ) {
        CallsEvents.sendEvent(
            root.reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_AUDIO_DEVICE_CHANGED,
            CallsUtils.convertDirectCallToJsMap(call),
            Arguments.createMap().apply {
                putString("currentAudioDevice", currentAudioDevice?.asString())
                putArray("availableAudioDevices", Arguments.fromList(availableAudioDevices.map { it.asString() }))
            }
        )
    }

    override fun onConnected(call: DirectCall) {
        CallsEvents.sendEvent(
            root.reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_CONNECTED,
            CallsUtils.convertDirectCallToJsMap(call)
        )
    }

    override fun onCustomItemsDeleted(call: DirectCall, deletedKeys: List<String>) {
        CallsEvents.sendEvent(
            root.reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_CUSTOM_ITEMS_DELETED,
            CallsUtils.convertDirectCallToJsMap(call),
            deletedKeys
        )
    }

    override fun onCustomItemsUpdated(call: DirectCall, updatedKeys: List<String>) {
        CallsEvents.sendEvent(
            root.reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_CUSTOM_ITEMS_UPDATED,
            CallsUtils.convertDirectCallToJsMap(call),
            updatedKeys
        )
    }

    override fun onEnded(call: DirectCall) {
        CallsEvents.sendEvent(
            root.reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_ENDED,
            CallsUtils.convertDirectCallToJsMap(call)
        )
    }

    override fun onEstablished(call: DirectCall) {
        CallsEvents.sendEvent(
            root.reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_ESTABLISHED,
            CallsUtils.convertDirectCallToJsMap(call)
        )
    }

    override fun onLocalVideoSettingsChanged(call: DirectCall) {
        CallsEvents.sendEvent(
            root.reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_LOCAL_VIDEO_SETTINGS_CHANGED,
            CallsUtils.convertDirectCallToJsMap(call)
        )
    }

    override fun onReconnected(call: DirectCall) {
        CallsEvents.sendEvent(
            root.reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_RECONNECTED,
            CallsUtils.convertDirectCallToJsMap(call)
        )
    }

    override fun onReconnecting(call: DirectCall) {
        CallsEvents.sendEvent(
            root.reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_RECONNECTING,
            CallsUtils.convertDirectCallToJsMap(call)
        )
    }

    override fun onRemoteAudioSettingsChanged(call: DirectCall) {
        CallsEvents.sendEvent(
            root.reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_REMOTE_AUDIO_SETTINGS_CHANGED,
            CallsUtils.convertDirectCallToJsMap(call)
        )
    }

    override fun onRemoteRecordingStatusChanged(call: DirectCall) {
        CallsEvents.sendEvent(
            root.reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_REMOTE_RECORDING_STATUS_CHANGED,
            CallsUtils.convertDirectCallToJsMap(call)
        )
    }

    override fun onRemoteVideoSettingsChanged(call: DirectCall) {
        CallsEvents.sendEvent(
            root.reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_REMOTE_VIDEO_SETTINGS_CHANGED,
            CallsUtils.convertDirectCallToJsMap(call)
        )
    }

    override fun onUserHoldStatusChanged(
        call: DirectCall,
        isLocalUser: Boolean,
        isUserOnHold: Boolean
    ) {
        CallsEvents.sendEvent(
            root.reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_USER_HOLD_STATUS_CHANGED,
            CallsUtils.convertDirectCallToJsMap(call),
            Arguments.createMap().apply {
                putBoolean("isLocalUser", isLocalUser)
                putBoolean("isUserOnHold", isUserOnHold)
            }
        )
    }
}
