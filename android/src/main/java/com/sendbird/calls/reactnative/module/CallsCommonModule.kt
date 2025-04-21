package com.sendbird.calls.reactnative.module

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.sendbird.calls.*
import com.sendbird.calls.reactnative.RNCallsInternalError
import com.sendbird.calls.reactnative.extension.rejectCalls
import com.sendbird.calls.reactnative.module.listener.CallsDirectCallListener
import com.sendbird.calls.reactnative.module.listener.CallsGroupCallListener
import com.sendbird.calls.reactnative.utils.CallsUtils
import com.sendbird.calls.reactnative.utils.RNCallsLogger

class CallsCommonModule(private val root: CallsModule): CommonModule {
    override fun setLoggerLevel(level: String) {
        RNCallsLogger.setLoggerLevel(level)
    }

    override fun addDirectCallSound(type: String, fileName: String) {
        RNCallsLogger.d("[CommonModule] addDirectCallSound($type, $fileName)")
        val soundType = SendBirdCall.SoundType.valueOf(type)
        val resourceId = root.reactContext.resources.getIdentifier(fileName, "raw", root.reactContext.packageName)
        if (resourceId != 0) {
            RNCallsLogger.d("[CommonModule] addDirectCallSound resource $resourceId")
            SendBirdCall.Options.addDirectCallSound(soundType, resourceId)
        }
    }

    override fun removeDirectCallSound(type: String) {
        RNCallsLogger.d("[CommonModule] removeDirectCallSound($type)")
        val soundType = SendBirdCall.SoundType.valueOf(type)
        SendBirdCall.Options.removeDirectCallSound(soundType)
    }

    override fun setDirectCallDialingSoundOnWhenSilentOrVibrateMode(enabled: Boolean) {
        RNCallsLogger.d("[CommonModule] setDirectCallDialingSoundOnWhenSilentOrVibrateMode($enabled)")
        SendBirdCall.Options.setDirectCallDialingSoundOnWhenSilentOrVibrateMode(enabled)
    }

    override fun getCurrentUser(promise: Promise) {
        RNCallsLogger.d("[CommonModule] getCurrentUser()")
        SendBirdCall.currentUser
            ?.let {
                promise.resolve(CallsUtils.convertUserToJsMap(it))
            }
            ?: run {
                promise.resolve(null)
            }
    }

    override fun getOngoingCalls(promise: Promise) {
        RNCallsLogger.d("[CommonModule] getOngoingCalls()")
        val list = SendBirdCall.ongoingCalls.map { CallsUtils.convertDirectCallToJsMap(it) }
        promise.resolve(CallsUtils.convertToJsArray(list))
    }

    override fun getDirectCall(callId: String, promise: Promise) {
        RNCallsLogger.d("[CommonModule] getDirectCall($callId)")
        SendBirdCall.getCall(callId)
            ?.let {
                promise.resolve(CallsUtils.convertDirectCallToJsMap(it))
            }
            ?: run {
                promise.rejectCalls(RNCallsInternalError("common/getDirectCall", RNCallsInternalError.Type.NOT_FOUND_DIRECT_CALL))
            }
    }

    override fun initialize(appId: String): Boolean {
        RNCallsLogger.d("[CommonModule] initialize()")
        return SendBirdCall.init(root.reactContext.applicationContext, appId)
    }

    override fun authenticate(authParams: ReadableMap, promise: Promise) {
        RNCallsLogger.d("[CommonModule] authenticate()")

        val userId = authParams.getString("userId")!!
        val accessToken = CallsUtils.safeGet { authParams.getString("accessToken") }

        val authenticateParams = AuthenticateParams(userId).apply {
            setAccessToken(accessToken)
        }

        SendBirdCall.authenticate(authenticateParams) { user, error ->
            error?.let {
                promise.rejectCalls(it)
            }
            user?.let {
                promise.resolve(CallsUtils.convertUserToJsMap(it))
            }
        }
    }

    override fun deauthenticate(promise: Promise) {
        RNCallsLogger.d("[CommonModule] deauthenticate()")
        SendBirdCall.deauthenticate { error ->
            error
                ?.let {
                    promise.rejectCalls(it)
                }
                ?: run {
                    promise.resolve(null)
                }
        }
    }

    override fun registerPushToken(token: String, unique: Boolean, promise: Promise) {
        RNCallsLogger.d("[CommonModule] registerPushToken()")
        SendBirdCall.registerPushToken(token, unique) { error ->
            error
                ?.let {
                    promise.rejectCalls(it)
                }
                ?: run {
                    promise.resolve(null)
                }
        }
    }

    override fun unregisterPushToken(token: String, promise: Promise) {
        RNCallsLogger.d("[CommonModule] unregisterPushToken()")
        SendBirdCall.unregisterPushToken(token) { error ->
            error
                ?.let {
                    promise.rejectCalls(it)
                }
                ?: run {
                    promise.resolve(null)
                }
        }
    }

    override fun dial(calleeId: String, isVideoCall: Boolean, options: ReadableMap, promise: Promise) {
        RNCallsLogger.d("[CommonModule] dial($calleeId)")
        RNCallsLogger.d("[CommonModule] dial options -> ${options.toHashMap()}")
        val from = "common/dial"

        val localVideoViewId = CallsUtils.safeGet { options.getInt("localVideoViewId") }
        val remoteVideoViewId = CallsUtils.safeGet { options.getInt("remoteVideoViewId") }
        val channelUrl = CallsUtils.safeGet { options.getString("channelUrl") }
        val audioEnabled = CallsUtils.safeGet { options.getBoolean("audioEnabled") }
        val videoEnabled = CallsUtils.safeGet { options.getBoolean("videoEnabled") }
        val frontCamera = CallsUtils.safeGet { options.getBoolean("frontCamera") }

        val dialPrams = DialParams(calleeId).apply {
            setVideoCall(isVideoCall)
            setCallOptions(CallOptions().apply {
                localVideoViewId?.let {
                    val surface = CallsUtils.findVideoView(root.reactContext, it, from).getSurface()
                    setLocalVideoView(surface)
                }
                remoteVideoViewId?.let {
                    val surface = CallsUtils.findVideoView(root.reactContext, it, from).getSurface()
                    setRemoteVideoView(surface)
                }
                audioEnabled?.let {
                    setAudioEnabled(it)
                }
                videoEnabled?.let {
                    setVideoEnabled(it)
                }
                frontCamera?.let {
                    setFrontCameraAsDefault(it)
                }
            })
            channelUrl?.let {
                val chatOptions = SendBirdChatOptions().apply {
                    setChannelUrl(it)
                }
                setSendBirdChatOptions(chatOptions)
            }
        }

        SendBirdCall.dial(dialPrams) { call, error ->
            error?.let {
                promise.rejectCalls(it)
            }
            call?.let {
                it.setListener(CallsDirectCallListener.get(root))
                promise.resolve(CallsUtils.convertDirectCallToJsMap(it))
            }
        }
    }

    override fun createRoom(params: ReadableMap, promise: Promise) {
        val roomType = CallsUtils.safeGet { params.getString("roomType") } ?: "SMALL_ROOM_FOR_VIDEO"
        RNCallsLogger.d("[CommonModule] createRoom($roomType)")

        val roomParams = RoomParams(RoomType.valueOf(roomType.uppercase()))
        SendBirdCall.createRoom(roomParams) { room, error ->
            error?.let {
                promise.rejectCalls(it)
            }
            room?.let {
                it.addListener(it.roomId, CallsGroupCallListener.get(root, it))
                promise.resolve(CallsUtils.convertRoomToJsMap(it))
            }
        }
    }

    override fun fetchRoomById(roomId: String, promise: Promise) {
        RNCallsLogger.d("[CommonModule] fetchRoomById($roomId)")
        SendBirdCall.fetchRoomById(roomId) { room, error ->
            error?.let {
                promise.rejectCalls(it)
            }
            room?.let {
                it.addListener(it.roomId, CallsGroupCallListener.get(root, it))
                promise.resolve(CallsUtils.convertRoomToJsMap(it))
            }
        }
    }

    override fun getCachedRoomById(roomId: String , promise: Promise) {
        RNCallsLogger.d("[CommonModule] getCachedRoomById($roomId)")
        SendBirdCall.getCachedRoomById(roomId)
            ?.let {
                promise.resolve(CallsUtils.convertRoomToJsMap(it))
            }
            ?: run {
                promise.resolve(null)
            }
    }
}
