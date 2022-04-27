package com.sendbird.calls.reactnative

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext

class CallsModule(private val reactContext: ReactApplicationContext) : CallsModuleStruct {
    private val commonModule: CommonModule = CallsModuleCommon(reactContext)

    /** Test module interface **/
    override fun multiply(a: Int, b: Int, promise: Promise) {
        promise.resolve(a * b)
    }

    /** Common module interface **/
    override fun init(appId: String, promise: Promise) = commonModule.init(appId, promise)
    override fun authenticate(userId: String, accessToken: String?, promise: Promise) = commonModule.authenticate(userId, accessToken, promise)
    override fun deauthenticate(promise: Promise) = commonModule.deauthenticate(promise)
    override fun registerPushToken(token: String, unique: Boolean, promise: Promise) = commonModule.registerPushToken(token, unique, promise)
    override fun unregisterPushToken(token: String, promise: Promise) = commonModule.unregisterPushToken(token, promise)

    companion object {
        const val NAME = "RNSendbirdCalls"
    }
}