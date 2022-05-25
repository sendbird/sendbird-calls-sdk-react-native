package com.sendbird.calls.reactnative.module

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.sendbird.calls.AcceptParams
import com.sendbird.calls.AudioDevice
import com.sendbird.calls.CallOptions
import com.sendbird.calls.DirectCall
import com.sendbird.calls.handler.DirectCallListener
import com.sendbird.calls.reactnative.CallsEvents
import com.sendbird.calls.reactnative.RNCallsInternalError
import com.sendbird.calls.reactnative.extension.asString
import com.sendbird.calls.reactnative.utils.CallsUtils

class CallsDirectCallModule(private val reactContext: ReactApplicationContext): DirectCallModule,
    DirectCallListener() {
    /** DirectCallMethods **/
    override fun selectVideoDevice(callId: String, device: ReadableMap, promise: Promise)  {
        val from = "directCall/selectVideoDevice"
        CallsUtils.safePromiseRejection(promise, from) {
            val call = CallsUtils.findDirectCall(callId, from)

            val deviceId = device.getString("deviceId")
            val position = device.getString("position")
            if (deviceId == null || position == null) throw RNCallsInternalError(from, RNCallsInternalError.Type.INVALID_PARAMS)
            else {
                when (val videoDevice = call.availableVideoDevices.find { it.deviceName === deviceId }) {
                    null -> throw RNCallsInternalError(from, RNCallsInternalError.Type.NOT_FOUND_VIDEO_DEVICE)
                    else -> call.selectVideoDevice(videoDevice) {
                        if (it !== null) throw it
                        else promise.resolve(null)
                    }
                }
            }
        }
    }

    override fun selectAudioDevice(callId: String, device: String, promise: Promise) {
        val from = "directCall/selectAudioDevice"
        CallsUtils.safePromiseRejection(promise, from) {
            val call = CallsUtils.findDirectCall(callId, from)
            val audioDevice = AudioDevice.valueOf(device)
            call.selectAudioDevice(audioDevice) {
                if (it !== null) throw it
                else promise.resolve(null)
            }
        }
    }

    override fun accept(callId: String, options: ReadableMap, holdActiveCall: Boolean, promise: Promise) {
        Log.d(CallsModule.NAME, "[DirectCallModule] accept() -> $callId")
        val from = "directCall/accept"
        CallsUtils.safePromiseRejection(promise, from) {
            val call = CallsUtils.findDirectCall(callId, from)

            Log.d(CallsModule.NAME, "[DirectCallModule] acceptParams -> ${options.toHashMap()}")


            val localVideoViewId = try {
                options.getInt("localVideoViewId")
            } catch(e:Throwable) {
                null
            }
            val remoteVideoViewId = try {
                options.getInt("remoteVideoViewId")
            } catch(e:Throwable) {
                null
            }
            val audioEnabled = options.getBoolean("audioEnabled") ?: true
            val videoEnabled = options.getBoolean("videoEnabled") ?: true
            val frontCamera = options.getBoolean("frontCamera") ?: true

            val acceptParams = AcceptParams().apply {
                setHoldActiveCall(holdActiveCall)
                setCallOptions(CallOptions().apply {
                    if(localVideoViewId != null) setLocalVideoView(CallsUtils.findVideoView(reactContext, localVideoViewId, from).getSurface())
                    if(remoteVideoViewId != null) setRemoteVideoView(CallsUtils.findVideoView(reactContext, remoteVideoViewId, from).getSurface())
                    setAudioEnabled(audioEnabled)
                    setVideoEnabled(videoEnabled)
                    setFrontCameraAsDefault(frontCamera)
                })
            }
            call.accept(acceptParams)
            promise.resolve(null)
        }
    }

    override fun end(callId: String, promise: Promise) {
        val from = "directCall/end"
        CallsUtils.safePromiseRejection(promise, from) {
            val call = CallsUtils.findDirectCall(callId, from)
            call.end()
            promise.resolve(null)
        }
    }

    override fun switchCamera(callId: String, promise: Promise) {
        val from = "directCall/switchCamera"
        CallsUtils.safePromiseRejection(promise, from) {
            val call = CallsUtils.findDirectCall(callId, from)
            call.switchCamera {
                if (it !== null) throw it
                else promise.resolve(null)
            }
        }
    }

    override fun startVideo(callId: String) {
        val from = "directCall/startVideo"
        try {
            val call = CallsUtils.findDirectCall(callId, from)
            call.startVideo()
        } finally { }
    }

    override fun stopVideo(callId: String) {
        val from = "directCall/stopVideo"
        try {
            val call = CallsUtils.findDirectCall(callId, from)
            call.stopVideo()
        } finally { }
    }

    override fun muteMicrophone(callId: String) {
        val from = "directCall/muteMicrophone"
        try {
            val call = CallsUtils.findDirectCall(callId, from)
            call.muteMicrophone()
        } finally { }
    }

    override fun unmuteMicrophone(callId: String) {
        val from = "directCall/unmuteMicrophone"
        try {
            val call = CallsUtils.findDirectCall(callId, from)
            call.unmuteMicrophone()
        } finally { }
    }

    override fun updateLocalVideoView(callId: String, videoViewId: Int) {
        val from = "directCall/updateLocalVideoView"
        try {
            val call = CallsUtils.findDirectCall(callId, from)
            val view = CallsUtils.findVideoView(reactContext, videoViewId, from)
            call.setLocalVideoView(view.getSurface())
        } finally { }
    }

    override fun updateRemoteVideoView(callId: String, videoViewId: Int) {
        val from = "directCall/updateRemoteVideoView"
        try {
            val call = CallsUtils.findDirectCall(callId, from)
            val view = CallsUtils.findVideoView(reactContext, videoViewId, from)
            call.setRemoteVideoView(view.getSurface())
        } finally { }
    }

    /** DirectCallListeners **/
    override fun onAudioDeviceChanged(
        call: DirectCall,
        currentAudioDevice: AudioDevice?,
        availableAudioDevices: MutableSet<AudioDevice>
    ) {
        CallsEvents.sendEvent(
            reactContext,
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
            reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_CONNECTED,
            CallsUtils.convertDirectCallToJsMap(call)
        )
    }

    override fun onCustomItemsDeleted(call: DirectCall, deletedKeys: List<String>) {
        CallsEvents.sendEvent(
            reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_CUSTOM_ITEMS_DELETED,
            CallsUtils.convertDirectCallToJsMap(call),
            deletedKeys
        )
    }

    override fun onCustomItemsUpdated(call: DirectCall, updatedKeys: List<String>) {
        CallsEvents.sendEvent(
            reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_CUSTOM_ITEMS_UPDATED,
            CallsUtils.convertDirectCallToJsMap(call),
            updatedKeys
        )
    }

    override fun onEnded(call: DirectCall) {
        CallsEvents.sendEvent(
            reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_ENDED,
            CallsUtils.convertDirectCallToJsMap(call)
        )
    }

    override fun onEstablished(call: DirectCall) {
        CallsEvents.sendEvent(
            reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_ESTABLISHED,
            CallsUtils.convertDirectCallToJsMap(call)
        )
    }

    override fun onLocalVideoSettingsChanged(call: DirectCall) {
        CallsEvents.sendEvent(
            reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_LOCAL_VIDEO_SETTINGS_CHANGED,
            CallsUtils.convertDirectCallToJsMap(call)
        )
    }

    override fun onReconnected(call: DirectCall) {
        CallsEvents.sendEvent(
            reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_RECONNECTED,
            CallsUtils.convertDirectCallToJsMap(call)
        )
    }

    override fun onReconnecting(call: DirectCall) {
        CallsEvents.sendEvent(
            reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_RECONNECTING,
            CallsUtils.convertDirectCallToJsMap(call)
        )
    }

    override fun onRemoteAudioSettingsChanged(call: DirectCall) {
        CallsEvents.sendEvent(
            reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_REMOTE_AUDIO_SETTINGS_CHANGED,
            CallsUtils.convertDirectCallToJsMap(call)
        )
    }

    override fun onRemoteRecordingStatusChanged(call: DirectCall) {
        CallsEvents.sendEvent(
            reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_REMOTE_RECORDING_STATUS_CHANGED,
            CallsUtils.convertDirectCallToJsMap(call)
        )
    }

    override fun onRemoteVideoSettingsChanged(call: DirectCall) {
        CallsEvents.sendEvent(
            reactContext,
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
            reactContext,
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