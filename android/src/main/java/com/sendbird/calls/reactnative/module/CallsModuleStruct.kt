package com.sendbird.calls.reactnative.module

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap

interface CallsModuleStruct: CommonModule, DirectCallModule, GroupCallModule { }

interface CommonModule {
    fun getCurrentUser(promise: Promise)
    fun getOngoingCalls(promise: Promise)
    fun getDirectCall(callId: String, promise: Promise)

    fun initialize(appId: String): Boolean

    fun authenticate(userId: String, accessToken: String?, promise: Promise)
    fun deauthenticate(promise: Promise)

    fun registerPushToken(token: String, unique: Boolean, promise: Promise)
    fun unregisterPushToken(token: String, promise: Promise)

    fun dial(calleeId: String, isVideoCall: Boolean, options: ReadableMap, promise: Promise)

    fun createRoom(roomType: String, promise: Promise)
    fun fetchRoomById(roomId: String, promise: Promise)
    fun getCachedRoomById(roomId: String, promise: Promise)

    fun muteMicrophone(isDirectCall: Boolean, identifier: String)
    fun unmuteMicrophone(isDirectCall: Boolean, identifier: String)
    fun stopVideo(isDirectCall: Boolean, identifier: String)
    fun startVideo(isDirectCall: Boolean, identifier: String)
    fun switchCamera(isDirectCall: Boolean, identifier: String, promise: Promise)
    fun selectAudioDevice(isDirectCall: Boolean, identifier: String, device: String, promise: Promise)
}

interface DirectCallModule {
    fun selectVideoDevice(callId: String, device: ReadableMap, promise: Promise)
    fun accept(callId: String, options: ReadableMap, holdActiveCall: Boolean, promise: Promise)
    fun end(callId: String, promise: Promise)
    fun updateLocalVideoView(callId: String, videoViewId: Int)
    fun updateRemoteVideoView(callId: String, videoViewId: Int)
}

interface GroupCallModule {
    fun enter(roomId: String, options: ReadableMap, promise: Promise)
    fun exit(roomId: String)
}
