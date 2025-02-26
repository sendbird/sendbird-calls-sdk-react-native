package com.sendbird.calls.reactnative.module

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.sendbird.calls.DirectCall
import com.sendbird.calls.RoomInvitation
import com.sendbird.calls.SendBirdCall
import com.sendbird.calls.handler.CompletionHandler
import com.sendbird.calls.handler.SendBirdCallListener
import com.sendbird.calls.reactnative.CallsEvents
import com.sendbird.calls.reactnative.module.listener.CallsDirectCallListener
import com.sendbird.calls.reactnative.module.listener.CallsGroupCallListener
import com.sendbird.calls.reactnative.utils.CallsUtils
import com.sendbird.calls.reactnative.utils.RNCallsLogger

class CallsModule(val reactContext: ReactApplicationContext) : CallsModuleStruct, SendBirdCallListener() {
    var initialized = false
    val directCallModule = CallsDirectCallModule(this)
    val groupCallModule = CallsGroupCallModule()
    val commonModule = CallsCommonModule(this)
    val queries = CallsQueries(this)

    fun invalidate(handler: CompletionHandler?) {
        SendBirdCall.Options.removeDirectCallSound(SendBirdCall.SoundType.RINGING)
        SendBirdCall.Options.removeDirectCallSound(SendBirdCall.SoundType.DIALING)
        SendBirdCall.Options.removeDirectCallSound(SendBirdCall.SoundType.RECONNECTED)
        SendBirdCall.Options.removeDirectCallSound(SendBirdCall.SoundType.RECONNECTING)

        if(initialized) {
            RNCallsLogger.d("[CallsModule] invalidate()")
            SendBirdCall.removeAllListeners()
            SendBirdCall.removeAllRecordingListeners()
            SendBirdCall.deauthenticate(handler)
            SendBirdCall.ongoingCalls.forEach { it.end() }
            CallsDirectCallListener.shared = null
            CallsGroupCallListener.invalidate()
        }
    }

    override fun onRinging(call: DirectCall) {
        RNCallsLogger.d("[CallsModule] onRinging() -> $call")
        // foreground -> sendEvent
        CallsEvents.sendEvent(
            reactContext,
            CallsEvents.EVENT_DEFAULT,
            CallsEvents.TYPE_DEFAULT_ON_RINGING,
            CallsUtils.convertDirectCallToJsMap(call)
        )

        call.setListener(CallsDirectCallListener(this))
    }
    override fun onInvitationReceived(invitation: RoomInvitation) {
        TODO("Not yet implemented")
    }

    /** Common module interface **/
    override fun setLoggerLevel(level: String) = commonModule.setLoggerLevel(level)
    override fun addDirectCallSound(type: String, fileName: String) = commonModule.addDirectCallSound(type, fileName)
    override fun removeDirectCallSound(type: String) = commonModule.removeDirectCallSound(type)
    override fun setDirectCallDialingSoundOnWhenSilentOrVibrateMode(enabled: Boolean) = commonModule.setDirectCallDialingSoundOnWhenSilentOrVibrateMode(enabled)
    override fun getCurrentUser(promise: Promise) = commonModule.getCurrentUser(promise)
    override fun getOngoingCalls(promise: Promise) = commonModule.getOngoingCalls(promise)
    override fun getDirectCall(callId: String, promise: Promise) = commonModule.getDirectCall(callId, promise)
    override fun initialize(appId: String): Boolean {
        RNCallsLogger.d("[CallsModule] initialize() -> $appId")
        initialized = commonModule.initialize(appId)
        SendBirdCall.addListener("sendbird.call.listener", this)
        return initialized
    }
    override fun authenticate(authParams: ReadableMap, promise: Promise) = commonModule.authenticate(authParams, promise)
    override fun deauthenticate(promise: Promise) = commonModule.deauthenticate(promise)
    override fun registerPushToken(token: String, unique: Boolean, promise: Promise) = commonModule.registerPushToken(token, unique, promise)
    override fun unregisterPushToken(token: String, promise: Promise) = commonModule.unregisterPushToken(token, promise)
    override fun dial(calleeId: String, isVideoCall: Boolean, options: ReadableMap, promise: Promise) = commonModule.dial(calleeId, isVideoCall, options, promise)
    override fun createRoom(params: ReadableMap, promise: Promise) = commonModule.createRoom(params, promise)
    override fun fetchRoomById(roomId: String, promise: Promise) = commonModule.fetchRoomById(roomId, promise)
    override fun getCachedRoomById(roomId: String, promise: Promise) = commonModule.getCachedRoomById(roomId, promise)

    /** Media Device control interface **/
    override fun stopVideo(type: String, identifier: String) = getControllableModule(type).stopVideo(type, identifier)
    override fun startVideo(type: String, identifier: String) = getControllableModule(type).startVideo(type, identifier)
    override fun muteMicrophone(type: String, identifier: String) = getControllableModule(type).muteMicrophone(type, identifier)
    override fun unmuteMicrophone(type: String, identifier: String) = getControllableModule(type).unmuteMicrophone(type, identifier)
    override fun switchCamera(type: String, identifier: String, promise: Promise) = getControllableModule(type).switchCamera(type, identifier, promise)
    override fun selectAudioDevice(type: String, identifier: String, device: String, promise: Promise) = getControllableModule(type).selectAudioDevice(type, identifier, device, promise)
    override fun selectVideoDevice(type: String, identifier: String, device: ReadableMap, promise: Promise) = getControllableModule(type).selectVideoDevice(type, identifier, device, promise)
    override fun resumeVideoCapturer(type: String, identifier: String) = getControllableModule(type).resumeVideoCapturer(type, identifier)
    override fun resumeAudioTrack(type: String, identifier: String) = getControllableModule(type).resumeAudioTrack(type, identifier)

    /** DirectCall module interface **/
    override fun accept(callId: String, options: ReadableMap, holdActiveCall: Boolean, promise: Promise) = directCallModule.accept(callId, options, holdActiveCall, promise)
    override fun end(callId: String, promise: Promise)= directCallModule.end(callId, promise)
    override fun updateLocalVideoView(callId: String, videoViewId: Int)= directCallModule.updateLocalVideoView(callId, videoViewId)
    override fun updateRemoteVideoView(callId: String, videoViewId: Int)= directCallModule.updateRemoteVideoView(callId, videoViewId)

    /** GroupCall module interface**/
    override fun enter(roomId: String, options: ReadableMap, promise: Promise) = groupCallModule.enter(roomId, options, promise)
    override fun exit(roomId: String) = groupCallModule.exit(roomId)

    /** Queries **/
    fun createDirectCallLogListQuery(params: ReadableMap, promise: Promise) = queries.createDirectCallLogListQuery(params, promise)
    fun createRoomListQuery(params: ReadableMap, promise: Promise) = queries.createRoomListQuery(params, promise)
    fun queryNext(key: String, type: String, promise: Promise) = queries.queryNext(key, type, promise)
    fun queryRelease(key: String) = queries.queryRelease(key)

    companion object {
        const val NAME = "RNSendbirdCalls"
    }

    private fun getControllableModule(type: String): MediaDeviceControl = when (ControllableModuleType.valueOf(type)) {
        ControllableModuleType.DIRECT_CALL -> directCallModule
        ControllableModuleType.GROUP_CALL -> groupCallModule
    }
}
