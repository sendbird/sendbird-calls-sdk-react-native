package com.sendbird.calls.reactnative.module

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.sendbird.calls.DirectCall
import com.sendbird.calls.SendBirdCall
import com.sendbird.calls.handler.CompletionHandler
import com.sendbird.calls.handler.SendBirdCallListener
import com.sendbird.calls.reactnative.CallsEvents
import com.sendbird.calls.reactnative.utils.CallsUtils

class CallsModule(private val reactContext: ReactApplicationContext) : CallsModuleStruct, SendBirdCallListener() {
    var initialized = false
    private val commonModule = CallsCommonModule(reactContext)
    private val directCallModule = CallsDirectCallModule(reactContext)
    private val groupCallModule = CallsGroupCallModule(reactContext)

    fun invalidate(handler: CompletionHandler?) {
        if(initialized) {
            Log.d(NAME, "[CallsModule] invalidate()")
            SendBirdCall.removeAllListeners()
            SendBirdCall.removeAllRecordingListeners()
            SendBirdCall.deauthenticate(handler)
            SendBirdCall.ongoingCalls.forEach { it.end() }
        }
    }

    override fun onRinging(call: DirectCall) {
        Log.d(NAME, "[CallsModule] onRinging() -> $call")
        // foreground -> sendEvent
        CallsEvents.sendEvent(
            reactContext,
            CallsEvents.EVENT_DEFAULT,
            CallsEvents.TYPE_DEFAULT_ON_RINGING,
            CallsUtils.convertDirectCallToJsMap(call)
        )

        // TODO: background -> startService
        //  run headless js task

        call.setListener(directCallModule)
    }

    /** Common module interface **/
    override fun getCurrentUser(promise: Promise) = commonModule.getCurrentUser(promise)
    override fun getOngoingCalls(promise: Promise) = commonModule.getOngoingCalls(promise)
    override fun initialize(appId: String): Boolean {
        Log.d(NAME, "[CallsModule] initialize() -> $appId")
        initialized = commonModule.initialize(appId)
        SendBirdCall.addListener("sendbird.call.listener", this)
        return initialized
    }
    override fun authenticate(userId: String, accessToken: String?, promise: Promise) = commonModule.authenticate(userId, accessToken, promise)
    override fun deauthenticate(promise: Promise) = commonModule.deauthenticate(promise)
    override fun registerPushToken(token: String, unique: Boolean, promise: Promise) = commonModule.registerPushToken(token, unique, promise)
    override fun unregisterPushToken(token: String, promise: Promise) = commonModule.unregisterPushToken(token, promise)
    override fun dial(calleeId: String, isVideoCall: Boolean, options: ReadableMap, promise: Promise) = commonModule.dial(calleeId, isVideoCall, options, promise)
    override fun createRoom(roomType: String, promise: Promise) = commonModule.createRoom(roomType, promise)
    override fun fetchRoomById(roomId: String, promise: Promise) = commonModule.fetchRoomById(roomId, promise)
    override fun getCachedRoomById(roomId: String, promise: Promise) = commonModule.getCachedRoomById(roomId, promise)

    /** DirectCall module interface**/
    override fun selectVideoDevice(callId: String, device: ReadableMap, promise: Promise)= directCallModule.selectVideoDevice(callId, device, promise)
    override fun selectAudioDevice(callId: String, device: String, promise: Promise)= directCallModule.selectAudioDevice(callId, device, promise)
    override fun accept(callId: String, options: ReadableMap, holdActiveCall: Boolean, promise: Promise) = directCallModule.accept(callId, options, holdActiveCall, promise)
    override fun end(callId: String, promise: Promise)= directCallModule.end(callId, promise)
    override fun switchCamera(callId: String, promise: Promise)= directCallModule.switchCamera(callId, promise)
    override fun startVideo(callId: String)= directCallModule.startVideo(callId)
    override fun stopVideo(callId: String)= directCallModule.stopVideo(callId)
    override fun muteMicrophone(callId: String)= directCallModule.muteMicrophone(callId)
    override fun unmuteMicrophone(callId: String)= directCallModule.unmuteMicrophone(callId)
    override fun updateLocalVideoView(callId: String, videoViewId: Int)= directCallModule.updateLocalVideoView(callId, videoViewId)
    override fun updateRemoteVideoView(callId: String, videoViewId: Int)= directCallModule.updateRemoteVideoView(callId, videoViewId)

    /** GroupCall module interface**/
    override fun enter(roomId: String, options: ReadableMap, promise: Promise) = groupCallModule.enter(roomId, options, promise)
    override fun exit(roomId: String) = groupCallModule.exit(roomId)

    companion object {
        const val NAME = "RNSendbirdCalls"
    }
}
