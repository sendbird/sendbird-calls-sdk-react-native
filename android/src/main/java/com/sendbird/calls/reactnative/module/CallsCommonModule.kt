package com.sendbird.calls.reactnative.module

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.sendbird.calls.AuthenticateParams
import com.sendbird.calls.SendBirdCall
import com.sendbird.calls.reactnative.CallsUtils

class CallsCommonModule(private val reactContext: ReactApplicationContext): CommonModule {
    override fun init(appId: String, promise: Promise) {
        val result = SendBirdCall.init(reactContext, appId)
        promise.resolve(result)
    }

    override fun getCurrentUser(promise: Promise) {
        val user = SendBirdCall.currentUser
        if(user == null) promise.resolve(null)
        else promise.resolve(CallsUtils.convertUserToJavascriptMap(user))
    }

    override fun authenticate(userId: String, accessToken: String?, promise: Promise) {
        val authParams = AuthenticateParams(userId).setAccessToken(accessToken)
        SendBirdCall.authenticate(authParams) { user, e ->
            if (user == null || e !== null) promise.reject(e)
            else promise.resolve(CallsUtils.convertUserToJavascriptMap(user))
        }
    }

    override fun deauthenticate(promise: Promise) {
        SendBirdCall.deauthenticate {
            CallsUtils.completionWithPromise(it, promise)
        }
    }

    override fun registerPushToken(token: String, unique: Boolean, promise: Promise) {
        SendBirdCall.registerPushToken(token, unique) {
            CallsUtils.completionWithPromise(it, promise)
        }
    }

    override fun unregisterPushToken(token: String, promise: Promise) {
        SendBirdCall.unregisterPushToken(token) {
            CallsUtils.completionWithPromise(it, promise)
        }
    }
}