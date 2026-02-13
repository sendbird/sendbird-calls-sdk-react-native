package com.sendbird.calls.reactnative.module

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.sendbird.calls.AcceptParams
import com.sendbird.calls.AudioDevice
import com.sendbird.calls.CallOptions
import com.sendbird.calls.SendBirdException
import com.sendbird.calls.reactnative.CallsEvents
import com.sendbird.calls.reactnative.RNCallsInternalError
import com.sendbird.calls.reactnative.extension.rejectCalls
import com.sendbird.calls.reactnative.utils.CallsUtils
import com.sendbird.calls.reactnative.utils.RNCallsLogger

class CallsDirectCallModule(private val root: CallsModule): DirectCallModule {
    val screenShareManager = ScreenShareManager(root.reactContext)

    fun cleanup() {
        screenShareManager.dispose()
    }
    override fun accept(callId: String, options: ReadableMap, holdActiveCall: Boolean, promise: Promise) {
        RNCallsLogger.d("[DirectCallModule] accept() -> $callId")

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
        RNCallsLogger.d("[DirectCallModule] end() -> $callId")

        CallsUtils.safeRun(promise) {
            val from = "directCall/end"
            CallsUtils.findDirectCall(callId, from).end()
            promise.resolve(null)
        }
    }

    override fun updateLocalVideoView(callId: String, videoViewId: Int) {
        RNCallsLogger.d("[DirectCallModule] updateLocalVideoView() -> $callId / $videoViewId")

        CallsUtils.safeRun {
            val from = "directCall/updateLocalVideoView"
            val call = CallsUtils.findDirectCall(callId, from)
            val view = CallsUtils.findVideoView(root.reactContext, videoViewId, from)
            call.setLocalVideoView(view.getSurface())
        }
    }

    override fun updateRemoteVideoView(callId: String, videoViewId: Int) {
        RNCallsLogger.d("[DirectCallModule] updateRemoteVideoView() -> $callId / $videoViewId")

        CallsUtils.safeRun {
            val from = "directCall/updateRemoteVideoView"
            val call = CallsUtils.findDirectCall(callId, from)
            val view = CallsUtils.findVideoView(root.reactContext, videoViewId, from)
            call.setRemoteVideoView(view.getSurface())
        }
    }

    override fun muteMicrophone(type: String, identifier: String) {
        val from = "directCall/muteMicrophone"
        RNCallsLogger.d("[DirectCallModule] $from ($identifier)")

        CallsUtils.safeRun {
            CallsUtils.findDirectCall(identifier, from).muteMicrophone()
        }
    }

    override fun unmuteMicrophone(type: String, identifier: String) {
        val from = "directCall/unmuteMicrophone"
        RNCallsLogger.d("[DirectCallModule] $from ($identifier)")

        CallsUtils.safeRun {
            CallsUtils.findDirectCall(identifier, from).unmuteMicrophone()
        }
    }

    override fun stopVideo(type: String, identifier: String) {
        val from = "directCall/stopVideo"
        RNCallsLogger.d("[DirectCallModule] $from ($identifier)")

        CallsUtils.safeRun {
            CallsUtils.findDirectCall(identifier, from).stopVideo()
        }
    }

    override fun startVideo(type: String, identifier: String) {
        val from = "directCall/startVideo"
        RNCallsLogger.d("[DirectCallModule] $from ($identifier)")

        CallsUtils.safeRun {
            CallsUtils.findDirectCall(identifier, from).startVideo()
        }
    }

    override fun switchCamera(type: String, identifier: String, promise: Promise) {
        val from = "directCall/switchCamera"
        RNCallsLogger.d("[DirectCallModule] $from ($identifier)")

        CallsUtils.safeRun(promise) {
            CallsUtils.findDirectCall(identifier, from).switchCamera { error ->
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

    override fun selectAudioDevice(type: String, identifier: String, device: String, promise: Promise) {
        val from = "directCall/switchCamera"
        RNCallsLogger.d("[DirectCallModule] $from ($identifier)")

        CallsUtils.safeRun(promise) {
            val audioDevice = AudioDevice.valueOf(device)

            CallsUtils.findDirectCall(identifier, from).selectAudioDevice(audioDevice) { error ->
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

    override fun selectVideoDevice(type: String, identifier: String, device: ReadableMap, promise: Promise)  {
        CallsUtils.safeRun(promise) {
            val from = "directCall/selectVideoDevice"
            val call = CallsUtils.findDirectCall(identifier, from)
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

    override fun resumeVideoCapturer(type: String, identifier: String) {
        val from ="directCall/resumeVideoCapturer"
        RNCallsLogger.d("[DirectCallModule] $from ($identifier)")

        CallsUtils.safeRun {
            CallsUtils.findDirectCall(identifier, from).resumeVideoCapturer()
        }
    }

    override fun resumeAudioTrack(type: String, identifier: String) {
        val from = "directCall/resumeAudioTrack"
        RNCallsLogger.d("[DirectCallModule] $from ($identifier)")

        CallsUtils.safeRun {
            CallsUtils.findDirectCall(identifier, from).resumeAudioTrack()
        }
    }

    override fun directCallUpdateCustomItems(callId: String, customItems: ReadableMap, promise: Promise) {
        val from = "directCall/updateCustomItems"
        RNCallsLogger.d("[DirectCallModule] $from ($callId)")

        CallsUtils.safeRun(promise) {
            val call = CallsUtils.findDirectCall(callId, from)
            val items = CallsUtils.convertMapToHashMap(customItems)

            call.updateCustomItems(items) { updatedItems, affectedKeys, error ->
                if (error != null) {
                    promise.rejectCalls(error)
                } else {
                    val result = CallsUtils.createMap().apply {
                        putMap("updatedItems", CallsUtils.convertHashMapToMap(updatedItems ?: hashMapOf()))
                        putArray("affectedKeys", CallsUtils.convertListToArray(affectedKeys ?: listOf()))
                    }
                    promise.resolve(result)
                }
            }
        }
    }

    override fun directCallDeleteCustomItems(callId: String, customItemKeys: ReadableArray, promise: Promise) {
        val from = "directCall/deleteCustomItems"
        RNCallsLogger.d("[DirectCallModule] $from ($callId)")

        CallsUtils.safeRun(promise) {
            val call = CallsUtils.findDirectCall(callId, from)
            val keys = CallsUtils.convertArrayToSet(customItemKeys)

            call.deleteCustomItems(keys) { updatedItems, affectedKeys, error ->
                if (error != null) {
                    promise.rejectCalls(error)
                } else {
                    val result = CallsUtils.createMap().apply {
                        putMap("updatedItems", CallsUtils.convertHashMapToMap(updatedItems ?: hashMapOf()))
                        putArray("affectedKeys", CallsUtils.convertListToArray(affectedKeys ?: listOf()))
                    }
                    promise.resolve(result)
                }
            }
        }
    }

    override fun directCallDeleteAllCustomItems(callId: String, promise: Promise) {
        val from = "directCall/deleteAllCustomItems"
        RNCallsLogger.d("[DirectCallModule] $from ($callId)")

        CallsUtils.safeRun(promise) {
            val call = CallsUtils.findDirectCall(callId, from)

            call.deleteAllCustomItems { updatedItems, affectedKeys, error ->
                if (error != null) {
                    promise.rejectCalls(error)
                } else {
                    val result = CallsUtils.createMap().apply {
                        putMap("updatedItems", CallsUtils.convertHashMapToMap(updatedItems ?: hashMapOf()))
                        putArray("affectedKeys", CallsUtils.convertListToArray(affectedKeys ?: listOf()))
                    }
                    promise.resolve(result)
                }
            }
        }
    }

    override fun startScreenShare(callId: String, promise: Promise) {
        val from = "directCall/startScreenShare"
        RNCallsLogger.d("[DirectCallModule] $from ($callId)")

        CallsUtils.safeRun(promise) {
            val call = CallsUtils.findDirectCall(callId, from)
            screenShareManager.start(promise) { data ->
                call.startScreenShare(data) { error ->
                    if (error != null) {
                        screenShareManager.cleanup()
                        promise.rejectCalls(error)
                    } else {
                        promise.resolve(null)
                        notifyLocalVideoSettingsChanged(call)
                    }
                }
            }
        }
    }

    override fun stopScreenShare(callId: String, promise: Promise) {
        val from = "directCall/stopScreenShare"
        RNCallsLogger.d("[DirectCallModule] $from ($callId)")

        try {
            val call = CallsUtils.findDirectCall(callId, from)
            call.stopScreenShare { error ->
                screenShareManager.cleanup()
                if (error != null) {
                    promise.rejectCalls(error)
                } else {
                    promise.resolve(null)
                    notifyLocalVideoSettingsChanged(call)
                }
            }
        } catch (e: Throwable) {
            screenShareManager.cleanup()
            when (e) {
                is SendBirdException -> promise.rejectCalls(e)
                is RNCallsInternalError -> promise.rejectCalls(e)
                else -> promise.reject(e)
            }
        }
    }

    // The native SDK's onLocalVideoSettingsChanged listener does not fire for screen share state changes.
    // We manually fire this event so the JS layer can update isLocalScreenShareEnabled via the listener.
    private fun notifyLocalVideoSettingsChanged(call: com.sendbird.calls.DirectCall) {
        CallsEvents.sendEvent(
            root.reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_LOCAL_VIDEO_SETTINGS_CHANGED,
            CallsUtils.convertDirectCallToJsMap(call)
        )
    }
}
