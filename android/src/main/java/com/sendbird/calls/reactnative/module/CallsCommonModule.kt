package com.sendbird.calls.reactnative.module

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.sendbird.calls.*
import com.sendbird.calls.reactnative.utils.CallsUtils

class CallsCommonModule(private val reactContext: ReactApplicationContext): CommonModule {
    override fun getCurrentUser(promise: Promise) {
        Log.d(CallsModule.NAME, "[CommonModule] getCurrentUser()")
        val user = SendBirdCall.currentUser
        if(user == null) promise.resolve(null)
        else promise.resolve(CallsUtils.convertUserToJsMap(user))
    }

    override fun getOngoingCalls(promise: Promise) {
        Log.d(CallsModule.NAME, "[CommonModule] getOngoingCalls()")
        val list = SendBirdCall.ongoingCalls.map { CallsUtils.convertDirectCallToJsMap(it) }
        promise.resolve(Arguments.fromList(list))
    }

    override fun initialize(appId: String): Boolean {
        Log.d(CallsModule.NAME, "[CommonModule] initialize($appId)")
        return SendBirdCall.init(reactContext, appId)
    }

    override fun authenticate(userId: String, accessToken: String?, promise: Promise) {
        Log.d(CallsModule.NAME, "[CommonModule] authenticate($userId, $accessToken)")
        val authParams = AuthenticateParams(userId).setAccessToken(accessToken)
        SendBirdCall.authenticate(authParams) { user, e ->
            if (user == null || e !== null) promise.reject(e)
            else promise.resolve(CallsUtils.convertUserToJsMap(user))
        }
    }

    override fun deauthenticate(promise: Promise) {
        Log.d(CallsModule.NAME, "[CommonModule] deauthenticate()")
        SendBirdCall.deauthenticate {
            CallsUtils.completionWithPromise(it, promise)
        }
    }

    override fun registerPushToken(token: String, unique: Boolean, promise: Promise) {
        Log.d(CallsModule.NAME, "[CommonModule] registerPushToken($token)")
        SendBirdCall.registerPushToken(token, unique) {
            CallsUtils.completionWithPromise(it, promise)
        }
    }

    override fun unregisterPushToken(token: String, promise: Promise) {
        Log.d(CallsModule.NAME, "[CommonModule] unregisterPushToken($token)")
        SendBirdCall.unregisterPushToken(token) {
            CallsUtils.completionWithPromise(it, promise)
        }
    }

    override fun dial(calleeId: String, options: ReadableMap, holdActiveCall: Boolean, promise: Promise) {
        Log.d(CallsModule.NAME, "[CommonModule] dial($calleeId)")
        val from = "common/dial"
        CallsUtils.safePromiseRejection(promise, from) {
            Log.d(CallsModule.NAME, "[CommonModule] dial options -> ${options.toHashMap()}")

            val localVideoViewId = try {
                options.getInt("localVideoViewId")
            } catch(e:Throwable) {
                null
            }
            val remoteVideoViewId = try {
                options.getInt("remoteVideoViewId")
            } catch(e:Throwable) {
                null
            }

            val audioEnabled = options.getBoolean("audioEnabled") ?: true
            val videoEnabled = options.getBoolean("videoEnabled") ?: true
            val frontCamera = options.getBoolean("frontCamera") ?: true

            val dialPrams = DialParams(calleeId).apply {
                setCallOptions(CallOptions().apply {
                    if(localVideoViewId != null) setLocalVideoView(CallsUtils.findVideoView(reactContext, localVideoViewId, from).getSurface())
                    if(remoteVideoViewId != null) setRemoteVideoView(CallsUtils.findVideoView(reactContext, remoteVideoViewId, from).getSurface())
                    setAudioEnabled(audioEnabled)
                    setVideoEnabled(videoEnabled)
                    setFrontCameraAsDefault(frontCamera)
                })
            }

            SendBirdCall.dial(dialPrams) { directCall: DirectCall?, error: SendBirdException? ->
                if(error != null) throw error
                if(directCall != null) promise.resolve(CallsUtils.convertDirectCallToJsMap(directCall))
            }
        }
    }
}
