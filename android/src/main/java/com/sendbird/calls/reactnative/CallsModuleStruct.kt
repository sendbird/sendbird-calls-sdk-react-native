package com.sendbird.calls.reactnative

import com.facebook.react.bridge.Promise

interface CallsModuleStruct: TestModule, CommonModule { }

interface TestModule {
    fun multiply(a: Int, b: Int, promise: Promise)
}

interface CommonModule {
    fun init(appId: String, promise: Promise)

    fun authenticate(userId: String, accessToken: String?, promise: Promise)
    fun deauthenticate(promise: Promise)

    fun registerPushToken(token: String, unique: Boolean, promise: Promise)
    fun unregisterPushToken(token: String, promise: Promise)
}
