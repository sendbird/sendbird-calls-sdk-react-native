package com.sendbird.calls.reactnative

import com.facebook.react.bridge.*
import com.sendbird.calls.reactnative.module.CallsModule
import com.sendbird.calls.reactnative.module.CallsModuleStruct

class RNSendbirdCallsModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext),
    CallsModuleStruct {
    private var module = CallsModule(reactContext)

    override fun getName(): String {
        return CallsModule.NAME
    }
    override fun getConstants(): Map<String, Any> {
        val constants: MutableMap<String, Any> = HashMap()
        constants["number"] = 90
        return constants
    }
    // For backward compat instead of invalidate
    @Deprecated("Deprecated in Java")
    override fun onCatalystInstanceDestroy() {
        this.module.invalidate(null)
        this.module = CallsModule(reactContext)
    }

    // JS -> Native
    @ReactMethod
    fun addListener(eventName: String) {}
    @ReactMethod
    fun removeListeners(count: Int) {}

    @ReactMethod(isBlockingSynchronousMethod = true)
    override fun initialize(appId: String) = module.initialize(appId)
    @ReactMethod
    override fun getCurrentUser(promise: Promise) = module.getCurrentUser(promise)
    @ReactMethod
    override fun authenticate(userId: String, accessToken: String?, promise: Promise) = module.authenticate(userId, accessToken, promise)
    @ReactMethod
    override fun deauthenticate(promise: Promise) = module.deauthenticate(promise)
    @ReactMethod
    override fun registerPushToken(token: String, unique: Boolean, promise: Promise) = module.registerPushToken(token, unique, promise)
    @ReactMethod
    override fun unregisterPushToken(token: String, promise: Promise) = module.unregisterPushToken(token, promise)

    @ReactMethod
    override fun selectVideoDevice(callId: String, device: ReadableNativeMap, promise: Promise) = module.selectVideoDevice(callId, device, promise)
    @ReactMethod
    override fun selectAudioDevice(callId: String, device: String, promise: Promise) = module.selectAudioDevice(callId, device, promise)
    @ReactMethod
    override fun accept(callId: String, options: ReadableNativeMap, holdActiveCall: Boolean, promise: Promise) = module.accept(callId, options, holdActiveCall, promise)
    @ReactMethod
    override fun end(callId: String, promise: Promise) = module.end(callId, promise)
    @ReactMethod
    override fun switchCamera(callId: String, promise: Promise) = module.switchCamera(callId, promise)
    @ReactMethod
    override fun startVideo(callId: String) = module.startVideo(callId)
    @ReactMethod
    override fun stopVideo(callId: String) = module.stopVideo(callId)
    @ReactMethod
    override fun muteMicrophone(callId: String) = module.muteMicrophone(callId)
    @ReactMethod
    override fun unmuteMicrophone(callId: String) = module.unmuteMicrophone(callId)
    @ReactMethod
    override fun updateLocalVideoView(callId: String, videoViewId: Int) = module.updateLocalVideoView(callId, videoViewId)
    @ReactMethod
    override fun updateRemoteVideoView(callId: String, videoViewId: Int) = module.updateRemoteVideoView(callId, videoViewId)
}
