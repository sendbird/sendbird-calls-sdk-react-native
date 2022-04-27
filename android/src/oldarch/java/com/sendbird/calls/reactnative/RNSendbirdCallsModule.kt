package com.sendbird.calls.reactnative

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class RNSendbirdCallsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return RNSendbirdCallsModuleImpl.NAME;
    }
    override fun getConstants(): Map<String, Any> {
        val constants: MutableMap<String, Any> = HashMap()
        constants["number"] = 90
        return constants
    }

    @ReactMethod
    fun multiply(a: Int, b: Int, promise: Promise) {
        RNSendbirdCallsModuleImpl.multiply(a, b, promise);
    }
}
