package com.sendbird.calls.reactnative

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

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

    @ReactMethod
    override fun multiply(a: Int, b: Int, promise: Promise) = module.multiply(a, b, promise)

    @ReactMethod
    override fun init(appId: String, promise: Promise) = module.init(appId, promise)
    @ReactMethod
    override fun authenticate(userId: String, accessToken: String?, promise: Promise) = module.authenticate(userId, accessToken, promise)
    @ReactMethod
    override fun deauthenticate(promise: Promise) = module.deauthenticate(promise)
    @ReactMethod
    override fun registerPushToken(token: String, unique: Boolean, promise: Promise) = module.registerPushToken(token, unique, promise)
    @ReactMethod
    override fun unregisterPushToken(token: String, promise: Promise) = module.unregisterPushToken(token, promise)
}
