package com.sendbird.calls.reactnative.module

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.sendbird.calls.SendBirdCall
import com.sendbird.calls.handler.CompletionHandler

class CallsModule(reactContext: ReactApplicationContext) : CallsModuleStruct {
    private val commonModule: CommonModule = CallsCommonModule(reactContext)

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
        fun invalidate(handler: CompletionHandler?) {
            SendBirdCall.removeAllListeners()
            SendBirdCall.removeAllRecordingListeners()
            SendBirdCall.deauthenticate(handler)
        }
    }
}