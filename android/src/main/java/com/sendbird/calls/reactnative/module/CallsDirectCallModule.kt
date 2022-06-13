package com.sendbird.calls.reactnative.module

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.sendbird.calls.*
import com.sendbird.calls.handler.DirectCallListener
import com.sendbird.calls.reactnative.CallsEvents
import com.sendbird.calls.reactnative.RNCallsInternalError
import com.sendbird.calls.reactnative.extension.asString
import com.sendbird.calls.reactnative.utils.CallsUtils

class CallsDirectCallModule(private val root: CallsModule): DirectCallModule,
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

            Log.d(CallsModule.NAME, "[DirectCallModule] accept options -> ${options.toHashMap()}")

            val localVideoViewId = CallsUtils.safeGet { options.getInt("localVideoViewId") }
            val remoteVideoViewId = CallsUtils.safeGet { options.getInt("remoteVideoViewId") }

            val audioEnabled = options.getBoolean("audioEnabled")
            val videoEnabled = options.getBoolean("videoEnabled")
            val frontCamera = options.getBoolean("frontCamera")

            val acceptParams = AcceptParams().apply {
                setHoldActiveCall(holdActiveCall)
                setCallOptions(CallOptions().apply {
                    if(localVideoViewId != null) setLocalVideoView(CallsUtils.findVideoView(root.reactContext, localVideoViewId, from).getSurface())
                    if(remoteVideoViewId != null) setRemoteVideoView(CallsUtils.findVideoView(root.reactContext, remoteVideoViewId, from).getSurface())
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
        Log.d(CallsModule.NAME, "[DirectCallModule] end() -> $callId")
        val from = "directCall/end"
        CallsUtils.safePromiseRejection(promise, from) {
            val call = CallsUtils.findDirectCall(callId, from)
            call.end()
            promise.resolve(null)
        }
    }

    override fun switchCamera(callId: String, promise: Promise) {
        Log.d(CallsModule.NAME, "[DirectCallModule] switchCamera() -> $callId")
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
        Log.d(CallsModule.NAME, "[DirectCallModule] startVideo() -> $callId")
        CallsUtils.safeRun {
            val call = CallsUtils.findDirectCall(callId,"directCall/startVideo")
            call.startVideo()
        }
    }

    override fun stopVideo(callId: String) {
        Log.d(CallsModule.NAME, "[DirectCallModule] stopVideo() -> $callId")
        CallsUtils.safeRun {
            val call = CallsUtils.findDirectCall(callId, "directCall/stopVideo")
            call.stopVideo()
        }
    }

    override fun muteMicrophone(callId: String) {
        Log.d(CallsModule.NAME, "[DirectCallModule] muteMicrophone() -> $callId")
        CallsUtils.safeRun {
            val call = CallsUtils.findDirectCall(callId, "directCall/muteMicrophone")
            call.muteMicrophone()
        }
    }

    override fun unmuteMicrophone(callId: String) {
        Log.d(CallsModule.NAME, "[DirectCallModule] unmuteMicrophone() -> $callId")
        CallsUtils.safeRun {
            val call = CallsUtils.findDirectCall(callId, "directCall/unmuteMicrophone")
            call.unmuteMicrophone()
        }
    }

    override fun updateLocalVideoView(callId: String, videoViewId: Int) {
        Log.d(CallsModule.NAME, "[DirectCallModule] updateLocalVideoView() -> $callId / $videoViewId")
        val from = "directCall/updateLocalVideoView"
        CallsUtils.safeRun {
            val call = CallsUtils.findDirectCall(callId, from)
            val view = CallsUtils.findVideoView(root.reactContext, videoViewId, from)
            call.setLocalVideoView(view.getSurface())
        }
    }

    override fun updateRemoteVideoView(callId: String, videoViewId: Int) {
        Log.d(CallsModule.NAME, "[DirectCallModule] updateRemoteVideoView() -> $callId / $videoViewId")
        val from = "directCall/updateRemoteVideoView"
        CallsUtils.safeRun {
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