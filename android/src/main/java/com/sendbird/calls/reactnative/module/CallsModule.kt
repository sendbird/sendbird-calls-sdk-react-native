package com.sendbird.calls.reactnative.module

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.sendbird.calls.DirectCall
import com.sendbird.calls.SendBirdCall
import com.sendbird.calls.handler.CompletionHandler
import com.sendbird.calls.handler.SendBirdCallListener
import com.sendbird.calls.reactnative.CallsEvents

class CallsModule(private val reactContext: ReactApplicationContext) : CallsModuleStruct, SendBirdCallListener() {
    private val commonModule = CallsCommonModule(reactContext)
    private val directCallModule = CallsDirectCallModule(reactContext)

    init {
        SendBirdCall.addListener("CallsModule", this)
    }

    fun invalidate(handler: CompletionHandler?) {
        SendBirdCall.removeAllListeners()
        SendBirdCall.removeAllRecordingListeners()
        SendBirdCall.deauthenticate(handler)
        SendBirdCall.ongoingCalls.forEach { it.end() }
    }

    override fun onRinging(call: DirectCall) {
        CallsEvents.sendEvent(
            reactContext,
            CallsEvents.EVENT_DIRECT_CALL,
            CallsEvents.TYPE_DIRECT_CALL_ON_RINGING,
            Arguments.createMap().apply {
                putString()
            }
        )
        call.setListener(directCallModule)
    }

    /** Test module interface **/
    override fun multiply(a: Int, b: Int, promise: Promise) {
        promise.resolve(a * b)
    }

    /** Common module interface **/
    override fun initialize(appId: String, promise: Promise) = commonModule.initialize(appId, promise)
    override fun getCurrentUser(promise: Promise) = commonModule.getCurrentUser(promise)
    override fun authenticate(userId: String, accessToken: String?, promise: Promise) = commonModule.authenticate(userId, accessToken, promise)
    override fun deauthenticate(promise: Promise) = commonModule.deauthenticate(promise)
    override fun registerPushToken(token: String, unique: Boolean, promise: Promise) = commonModule.registerPushToken(token, unique, promise)
    override fun unregisterPushToken(token: String, promise: Promise) = commonModule.unregisterPushToken(token, promise)

    companion object {
        const val NAME = "RNSendbirdCalls"
    }
}