package com.sendbird.calls.reactnative.module

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.sendbird.calls.*
import com.sendbird.calls.reactnative.RNCallsInternalError
import com.sendbird.calls.reactnative.extension.rejectCalls
import com.sendbird.calls.reactnative.utils.CallsUtils
import com.sendbird.calls.reactnative.utils.RNCallsLogger

class CallsGroupCallModule: GroupCallModule {
    override fun enter(roomId: String, options: ReadableMap, promise: Promise) {
        val from = "room.enter"
        RNCallsLogger.d("[GroupCallModule] $from(roomId:$roomId, options:${options.toHashMap()})")

        CallsUtils.safeRun(promise) {
            val room = CallsUtils.findRoom(roomId, from)

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

            room.enter(enterParams) { error ->
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

    override fun exit(roomId: String) {
        val from = "room.exit"
        RNCallsLogger.d("[GroupCallModule] $from(roomId:$roomId)")
        CallsUtils.safeRun {
            CallsUtils.findRoom(roomId, from).exit()
        }
    }

    override fun accept(roomInvitationId: String, promise: Promise) {
        val from = "roomInvitation.accept"
        RNCallsLogger.d("[GroupCallModule] $from(roomInvitationId:$roomInvitationId)")

        CallsUtils.safeRun(promise) {
            CallsUtils.findRoomInvitation(roomInvitationId, from).accept { error ->
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

    override fun cancel(roomInvitationId: String, promise: Promise) {
        val from = "roomInvitation.cancel"
        RNCallsLogger.d("[GroupCallModule] $from(roomInvitationId:$roomInvitationId)")

        CallsUtils.safeRun(promise) {
            CallsUtils.findRoomInvitation(roomInvitationId, from).cancel { error ->
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

    override fun decline(roomInvitationId: String, promise: Promise) {
        val from = "roomInvitation.decline"
        RNCallsLogger.d("[GroupCallModule] $from(roomInvitationId:$roomInvitationId)")

        CallsUtils.safeRun(promise) {
            CallsUtils.findRoomInvitation(roomInvitationId, from).decline { error ->
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

    override fun muteMicrophone(type: String, identifier: String) {
        val from = "room.localParticipant.muteMicrophone"
        RNCallsLogger.d("[GroupCallModule] $from(type:$type, identifier:$identifier)")

        CallsUtils.safeRun {
            CallsUtils.findRoom(identifier, from).localParticipant?.muteMicrophone()
        }
    }

    override fun unmuteMicrophone(type: String, identifier: String) {
        val from = "room.localParticipant.unmuteMicrophone"
        RNCallsLogger.d("[GroupCallModule] $from(type:$type, identifier:$identifier)")

        CallsUtils.safeRun {
            CallsUtils.findRoom(identifier, from).localParticipant?.unmuteMicrophone()
        }
    }

    override fun stopVideo(type: String, identifier: String) {
        val from = "room.localParticipant.stopVideo"
        RNCallsLogger.d("[GroupCallModule] $from(type:$type, identifier:$identifier)")

        CallsUtils.safeRun {
            CallsUtils.findRoom(identifier, from).localParticipant?.stopVideo()
        }
    }

    override fun startVideo(type: String, identifier: String) {
        val from = "room.localParticipant.startVideo"
        RNCallsLogger.d("[GroupCallModule] $from(type:$type, identifier:$identifier)")

        CallsUtils.safeRun {
            CallsUtils.findRoom(identifier, from).localParticipant?.startVideo()
        }
    }

    override fun switchCamera(type: String, identifier: String, promise: Promise) {
        val from = "room.localParticipant.switchCamera"
        RNCallsLogger.d("[GroupCallModule] $from(type:$type, identifier:$identifier)")

        CallsUtils.safeRun(promise) {
            CallsUtils.findRoom(identifier, from).localParticipant?.switchCamera { error ->
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
        val from = "room.selectAudioDevice"
        RNCallsLogger.d("[GroupCallModule] $from(type:$type, identifier:$identifier, device:$device)")

        CallsUtils.safeRun(promise) {
            val audioDevice = AudioDevice.valueOf(device)
            CallsUtils.findRoom(identifier, from).selectAudioDevice(audioDevice) { error ->
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

    override fun selectVideoDevice(
        type: String,
        identifier: String,
        device: ReadableMap,
        promise: Promise
    ) {
        // NOOP
        promise.resolve(null)
    }

    override fun resumeVideoCapturer(type: String, identifier: String) {
        val from = "room.localParticipant.resumeVideoCapturer"
        RNCallsLogger.d("[GroupCallModule] $from(type:$type, identifier:$identifier)")

        CallsUtils.safeRun {
            CallsUtils.findRoom(identifier, from).localParticipant?.resumeVideoCapturer()
        }
    }
}
