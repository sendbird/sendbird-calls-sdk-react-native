package com.sendbird.calls.reactnative

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.sendbird.calls.reactnative.module.CallsModule
import com.sendbird.calls.reactnative.module.CallsModuleStruct

class RNSendbirdCallsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext),
    CallsModuleStruct {

    private val module = CallsModule(reactContext)

    override fun getName(): String {
        return CallsModule.NAME;
    }
    override fun getConstants(): Map<String, Any> {
        val constants: MutableMap<String, Any> = HashMap()
        constants["number"] = 90
        return constants
    }
    // Backward compat
    @Deprecated("Deprecated in Java")
    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        CallsModule.invalidate(null)
    }
    override fun invalidate() {
        super.invalidate()
        CallsModule.invalidate(null)
    }

    @ReactMethod override fun multiply(a: Int, b: Int, promise: Promise) = module.multiply(a, b, promise)

    @ReactMethod override fun initialize(appId: String, promise: Promise) = module.initialize(appId, promise)
    @ReactMethod override fun getCurrentUser(promise: Promise) = module.getCurrentUser(promise)
    @ReactMethod override fun authenticate(userId: String, accessToken: String?, promise: Promise) = module.authenticate(userId, accessToken, promise)
    @ReactMethod override fun deauthenticate(promise: Promise) = module.deauthenticate(promise)
    @ReactMethod override fun registerPushToken(token: String, unique: Boolean, promise: Promise) = module.registerPushToken(token, unique, promise)
    @ReactMethod override fun unregisterPushToken(token: String, promise: Promise) = module.unregisterPushToken(token, promise)
}
