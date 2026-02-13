package com.sendbird.calls.reactnative.module

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

interface CallsModuleStruct: CommonModule, DirectCallModule, GroupCallModule { }

interface CommonModule {
    fun setLoggerLevel(level: String)

    fun addDirectCallSound(type: String, fileName: String)
    fun removeDirectCallSound(type: String)
    fun setDirectCallDialingSoundOnWhenSilentOrVibrateMode(enabled: Boolean)

    fun getCurrentUser(promise: Promise)
    fun getOngoingCalls(promise: Promise)
    fun getDirectCall(callId: String, promise: Promise)

    fun initialize(appId: String): Boolean

    fun authenticate(authParams: ReadableMap, promise: Promise)
    fun deauthenticate(promise: Promise)

    fun registerPushToken(token: String, unique: Boolean, promise: Promise)
    fun unregisterPushToken(token: String, promise: Promise)

    fun dial(calleeId: String, isVideoCall: Boolean, options: ReadableMap, promise: Promise)

    fun createRoom(params: ReadableMap, promise: Promise)
    fun fetchRoomById(roomId: String, promise: Promise)
    fun getCachedRoomById(roomId: String, promise: Promise)

    fun updateCustomItems(callId: String, customItems: ReadableMap, promise: Promise)
    fun deleteCustomItems(callId: String, customItemKeys: ReadableArray, promise: Promise)
    fun deleteAllCustomItems(callId: String, promise: Promise)
}

interface DirectCallModule: MediaDeviceControl {
    fun accept(callId: String, options: ReadableMap, holdActiveCall: Boolean, promise: Promise)
    fun end(callId: String, promise: Promise)
    fun updateLocalVideoView(callId: String, videoViewId: Int)
    fun updateRemoteVideoView(callId: String, videoViewId: Int)
    fun directCallUpdateCustomItems(callId: String, customItems: ReadableMap, promise: Promise)
    fun directCallDeleteCustomItems(callId: String, customItemKeys: ReadableArray, promise: Promise)
    fun directCallDeleteAllCustomItems(callId: String, promise: Promise)
    fun startScreenShare(callId: String, promise: Promise)
    fun stopScreenShare(callId: String, promise: Promise)
}

interface GroupCallModule: MediaDeviceControl {
    fun enter(roomId: String, options: ReadableMap, promise: Promise)
    fun exit(roomId: String)
    fun groupCallUpdateCustomItems(roomId: String, customItems: ReadableMap, promise: Promise)
    fun groupCallDeleteCustomItems(roomId: String, customItemKeys: ReadableArray, promise: Promise)
    fun groupCallDeleteAllCustomItems(roomId: String, promise: Promise)
}

enum class ControllableModuleType {
    DIRECT_CALL,
    GROUP_CALL
}

interface MediaDeviceControl {
    fun muteMicrophone(type: String, identifier: String)
    fun unmuteMicrophone(type: String, identifier: String)
    fun stopVideo(type: String, identifier: String)
    fun startVideo(type: String, identifier: String)
    fun switchCamera(type: String, identifier: String, promise: Promise)
    fun selectAudioDevice(type: String, identifier: String, device: String, promise: Promise)
    fun selectVideoDevice(type: String, identifier: String, device: ReadableMap, promise: Promise)
    fun resumeVideoCapturer(type: String, identifier: String)
    fun resumeAudioTrack(type: String, identifier: String)
}
