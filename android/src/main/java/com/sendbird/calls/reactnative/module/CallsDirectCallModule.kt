package com.sendbird.calls.reactnative.module

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.sendbird.calls.AcceptParams
import com.sendbird.calls.AudioDevice
import com.sendbird.calls.CallOptions
import com.sendbird.calls.reactnative.RNCallsInternalError
import com.sendbird.calls.reactnative.extension.rejectCalls
import com.sendbird.calls.reactnative.utils.CallsUtils
import com.sendbird.calls.reactnative.utils.RNCallsLogger

class CallsDirectCallModule(private val root: CallsModule): DirectCallModule {
    override fun accept(callId: String, options: ReadableMap, holdActiveCall: Boolean, promise: Promise) {
        val from = "directCall.accept"
        RNCallsLogger.d("[DirectCallModule] $from(callId:$callId, options:${options.toHashMap()}, holdActiveCall:$holdActiveCall)")

        CallsUtils.safeRun(promise) {
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
        val from = "directCall.end"
        RNCallsLogger.d("[DirectCallModule] $from(callId:$callId)")

        CallsUtils.safeRun(promise) {
            CallsUtils.findDirectCall(callId, from).end()
            promise.resolve(null)
        }
    }

    override fun updateLocalVideoView(callId: String, videoViewId: Int) {
        val from = "directCall.updateLocalVideoView"
        RNCallsLogger.d("[DirectCallModule] $from(callId:$callId, videoViewId:$videoViewId)")

        CallsUtils.safeRun {
            val call = CallsUtils.findDirectCall(callId, from)
            val view = CallsUtils.findVideoView(root.reactContext, videoViewId, from)
            call.setLocalVideoView(view.getSurface())
        }
    }

    override fun updateRemoteVideoView(callId: String, videoViewId: Int) {
        val from = "directCall.updateRemoteVideoView"
        RNCallsLogger.d("[DirectCallModule] $from(callId:$callId, videoViewId:$videoViewId)")

        CallsUtils.safeRun {
            val call = CallsUtils.findDirectCall(callId, from)
            val view = CallsUtils.findVideoView(root.reactContext, videoViewId, from)
            call.setRemoteVideoView(view.getSurface())
        }
    }
    
    override fun muteMicrophone(type: String, identifier: String) {
        val from = "directCall.muteMicrophone"
        RNCallsLogger.d("[DirectCallModule] $from(type:$type, identifier:$identifier)")

        CallsUtils.safeRun {
            CallsUtils.findDirectCall(identifier, from).muteMicrophone()
        }
    }

    override fun unmuteMicrophone(type: String, identifier: String) {
        val from = "directCall.unmuteMicrophone"
        RNCallsLogger.d("[DirectCallModule] $from(type:$type, identifier:$identifier)")

        CallsUtils.safeRun {
            CallsUtils.findDirectCall(identifier, from).unmuteMicrophone()
        }
    }

    override fun stopVideo(type: String, identifier: String) {
        val from = "directCall.stopVideo"
        RNCallsLogger.d("[DirectCallModule] $from(type:$type, identifier:$identifier)")

        CallsUtils.safeRun {
            CallsUtils.findDirectCall(identifier, from).stopVideo()
        }
    }

    override fun startVideo(type: String, identifier: String) {
        val from = "directCall.startVideo"
        RNCallsLogger.d("[DirectCallModule] $from(type:$type, identifier:$identifier)")

        CallsUtils.safeRun {
            CallsUtils.findDirectCall(identifier, from).startVideo()
        }
    }

    override fun switchCamera(type: String, identifier: String, promise: Promise) {
        val from = "directCall.switchCamera"
        RNCallsLogger.d("[DirectCallModule] $from(type:$type, identifier:$identifier)")

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
        val from = "directCall.selectAudioDevice"
        RNCallsLogger.d("[DirectCallModule] $from(type:$type, identifier:$identifier, device:$device)")

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
        val from = "directCall.selectVideoDevice"
        RNCallsLogger.d("[DirectCallModule] $from(type:$type, identifier:$identifier, device:${device.toHashMap()})")

        CallsUtils.safeRun(promise) {
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
        val from ="directCall.resumeVideoCapturer"
        RNCallsLogger.d("[DirectCallModule] $from(type:$type, identifier:$identifier)")

        CallsUtils.safeRun {
            CallsUtils.findDirectCall(identifier, from).resumeVideoCapturer()
        }
    }
}
