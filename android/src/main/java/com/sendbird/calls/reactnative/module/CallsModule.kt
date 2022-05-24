package com.sendbird.calls.reactnative.module

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableNativeMap
import com.sendbird.calls.AcceptParams
import com.sendbird.calls.DirectCall
import com.sendbird.calls.SendBirdCall
import com.sendbird.calls.handler.CompletionHandler
import com.sendbird.calls.handler.SendBirdCallListener
import com.sendbird.calls.reactnative.CallsEvents
import com.sendbird.calls.reactnative.CallsUtils

class CallsModule(private val reactContext: ReactApplicationContext) : CallsModuleStruct, SendBirdCallListener() {
    var initialized = false
    private val commonModule = CallsCommonModule(reactContext)
    private val directCallModule = CallsDirectCallModule(reactContext)

    fun invalidate(handler: CompletionHandler?) {
        if(initialized) {
            log("invalidate module")
            SendBirdCall.removeAllListeners()
            SendBirdCall.removeAllRecordingListeners()
            SendBirdCall.deauthenticate(handler)
            SendBirdCall.ongoingCalls.forEach { it.end() }
        }
    }

    override fun onRinging(call: DirectCall) {
        CallsEvents.sendEvent(
            reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DEFAULT_ON_RINGING,
            CallsUtils.convertDirectCallToJsMap(call)
        )
        call.setListener(directCallModule)
        call.accept(AcceptParams())
    }

    /** Common module interface **/
    override fun initialize(appId: String): Boolean {
        initialized = commonModule.initialize(appId)
        return initialized
    }

    override fun getCurrentUser(promise: Promise) = commonModule.getCurrentUser(promise)
    override fun authenticate(userId: String, accessToken: String?, promise: Promise) = commonModule.authenticate(userId, accessToken, promise)
    override fun deauthenticate(promise: Promise) = commonModule.deauthenticate(promise)
    override fun registerPushToken(token: String, unique: Boolean, promise: Promise) = commonModule.registerPushToken(token, unique, promise)
    override fun unregisterPushToken(token: String, promise: Promise) = commonModule.unregisterPushToken(token, promise)

    /** DirectCall module interface**/
    override fun selectVideoDevice(callId: String, device: ReadableNativeMap, promise: Promise)= directCallModule.selectVideoDevice(callId, device, promise)
    override fun selectAudioDevice(callId: String, device: String, promise: Promise)= directCallModule.selectAudioDevice(callId, device, promise)
    override fun accept(callId: String, options: ReadableNativeMap, holdActiveCall: Boolean, promise: Promise) = directCallModule.accept(callId, options, holdActiveCall, promise)
    override fun end(callId: String, promise: Promise)= directCallModule.end(callId, promise)
    override fun switchCamera(callId: String, promise: Promise)= directCallModule.switchCamera(callId, promise)
    override fun startVideo(callId: String)= directCallModule.startVideo(callId)
    override fun stopVideo(callId: String)= directCallModule.stopVideo(callId)
    override fun muteMicrophone(callId: String)= directCallModule.muteMicrophone(callId)
    override fun unmuteMicrophone(callId: String)= directCallModule.unmuteMicrophone(callId)
    override fun updateLocalVideoView(callId: String, videoViewId: Int)= directCallModule.updateLocalVideoView(callId, videoViewId)
    override fun updateRemoteVideoView(callId: String, videoViewId: Int)= directCallModule.updateRemoteVideoView(callId, videoViewId)

    companion object {
        const val NAME = "RNSendbirdCalls"
        fun log(msg: String) {
            Log.d(NAME, msg)
        }
    }
}