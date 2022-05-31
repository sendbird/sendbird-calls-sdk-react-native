package com.sendbird.calls.reactnative.utils

import android.app.ActivityManager
import android.app.ActivityManager.*
import android.content.Context
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.common.LifecycleState
import com.sendbird.calls.*
import com.sendbird.calls.reactnative.RNCallsInternalError
import com.sendbird.calls.reactnative.RNSBDirectCallVideoView
import com.sendbird.calls.reactnative.extension.asString
import com.sendbird.calls.reactnative.module.CallsModule
import com.sendbird.calls.reactnative.view.BaseVideoView


object CallsUtils {
    fun <T> safeGet(fn: () -> T): T? {
        return try {
            fn()
        } catch (e: Throwable){
            null
        }
    }
    fun safePromiseRejection(promise: Promise, from: String?, completion: () -> Any?) {
        try {
            completion()
        } catch (e: Throwable) {
            Log.e(CallsModule.NAME, "safePromiseRejection error -> $e")
            when (e) {
                is SendBirdException -> promise.reject(e.code.toString(), e.message, e)
                is RNCallsInternalError -> promise.reject(e.code, e.message, e)
                else -> promise.reject(RNCallsInternalError(from, RNCallsInternalError.Type.UNKNOWN))
            }
        }
    }

    fun findDirectCall(callId: String, from: String?): DirectCall {
        return SendBirdCall.getCall(callId) ?: throw RNCallsInternalError(from, RNCallsInternalError.Type.NOT_FOUND_DIRECT_CALL)
    }
    fun findVideoView(context: ReactContext, viewId: Int, from: String?): BaseVideoView {
        return context.currentActivity?.findViewById(viewId) ?: throw RNCallsInternalError(from, RNCallsInternalError.Type.NOT_FOUND_VIDEO_VIEW)
    }

    /** Completion utils **/
    fun completionWithPromise(e: SendBirdException?, promise: Promise) {
        when {
            e !== null -> promise.reject(e)
            else -> promise.resolve(null)
        }
    }

    /** Data conversion utils **/
    fun insertMap(jsMap: WritableMap, key: String, value: Any?) = when (value) {
        is Boolean -> jsMap.putBoolean(key, value)
        is String -> jsMap.putString(key, value)
        is Double -> jsMap.putDouble(key, value)
        is Float -> jsMap.putDouble(key, value.toDouble())
        is Long -> jsMap.putInt(key, value.toInt())
        is Int -> jsMap.putInt(key, value)

        is Map<*, *> -> jsMap.putMap(key, convertToJsMap(value))
        is Array<*> -> jsMap.putArray(key, convertToJsArray(value))
        is List<*> -> jsMap.putArray(key, convertToJsArray(value))

        is WritableNativeMap -> jsMap.putMap(key, value)
        is ReadableNativeMap -> jsMap.putMap(key, value)
        is WritableNativeArray -> jsMap.putArray(key, value)
        is ReadableNativeArray -> jsMap.putArray(key, value)
        else -> {
            if(value == null) jsMap.putNull(key)
            else throw Error("Unknown type")
        }
    }
    fun insertArr(jsArr: WritableArray, value: Any?) = when (value) {
        is Boolean -> jsArr.pushBoolean(value)
        is String -> jsArr.pushString(value)
        is Double -> jsArr.pushDouble(value)
        is Float -> jsArr.pushDouble(value.toDouble())
        is Long -> jsArr.pushInt(value.toInt())
        is Int -> jsArr.pushInt(value)

        is Map<*, *> -> jsArr.pushMap(convertToJsMap(value))
        is Array<*> -> jsArr.pushArray(convertToJsArray(value))
        is List<*> -> jsArr.pushArray(convertToJsArray(value))

        is WritableNativeMap -> jsArr.pushMap(value)
        is ReadableNativeMap -> jsArr.pushMap(value)
        is WritableNativeArray -> jsArr.pushArray(value)
        is ReadableNativeArray -> jsArr.pushArray(value)
        else -> {
            if(value == null) jsArr.pushNull()
            else throw Error("Unknown type")
        }
    }
    fun convertToJsMap(nativeMap: Map<*, *>): WritableNativeMap {
        val jsMap = WritableNativeMap()
        val keyIterator = nativeMap.keys.iterator();
        while(keyIterator.hasNext()) {
            val key = keyIterator.next()
            val value = nativeMap.get(key)
            if(key is String) insertMap(jsMap, key, value)
        }
        return jsMap
    }
    fun convertToJsArray(nativeList: List<*>): WritableNativeArray {
        val jsArr = WritableNativeArray()
        val iterator = nativeList.iterator()
        while (iterator.hasNext()) {
            val value = iterator.next()
            insertArr(jsArr, value)
        }
        return jsArr
    }
    fun convertToJsArray(nativeArr: Array<*>): WritableNativeArray {
        val jsArr = WritableNativeArray()
        val iterator = nativeArr.iterator()
        while (iterator.hasNext()) {
            val value = iterator.next()
            insertArr(jsArr, value)
        }
        return jsArr
    }
    fun convertUserToJsMap(user: User) = convertToJsMap(mapOf(
        "userId" to user.userId,
        "isActive" to user.isActive,
        "nickname" to (user.nickname ?: ""),
        "metaData" to (user.metaData ?: WritableNativeMap()),
        "profileUrl" to (user.profileUrl ?: "")
    ))
    fun convertDirectCallToJsMap(call: DirectCall) = convertToJsMap(mapOf(
        "callId" to call.callId,
        "callLog" to when(call.callLog) {
            null -> null
            else -> convertDirectCallLogToJsMap(call.callLog!!)
        },
        "callee" to convertDirectCallUserToJsMap(call.callee),
        "caller" to convertDirectCallUserToJsMap(call.caller),
        "endedBy" to convertDirectCallUserToJsMap(call.endedBy),
        "customItems" to call.customItems,
        "duration" to call.duration,
        "endResult" to call.endResult.asString(),
        "localUser" to convertDirectCallUserToJsMap(call.localUser),
        "remoteUser" to convertDirectCallUserToJsMap(call.remoteUser),
        "myRole" to call.myRole!!.asString(),
        "availableVideoDevices" to call.availableVideoDevices.map { getVideoDevice(it) },
        "currentVideoDevice" to getVideoDevice(call.currentVideoDevice),
        "availableAudioDevices" to call.availableAudioDevices.map { it.asString() },
        "currentAudioDevice" to call.currentAudioDevice?.asString(),
        "isEnded" to call.isEnded,
        "isOnHold" to call.isOnHold,
        "isOngoing" to call.isOngoing,
        "isVideoCall" to call.isVideoCall,
        "isLocalScreenShareEnabled" to call.isLocalScreenShareEnabled,
        "isLocalAudioEnabled" to call.isLocalAudioEnabled,
        "isLocalVideoEnabled" to call.isLocalVideoEnabled,
        "isRemoteAudioEnabled" to call.isRemoteAudioEnabled,
        "isRemoteVideoEnabled" to call.isRemoteVideoEnabled,
        "localRecordingStatus" to call.localRecordingStatus.asString(),
        "remoteRecordingStatus" to call.remoteRecordingStatus.asString(),
    ))

    fun convertDirectCallLogToJsMap(callLog: DirectCallLog) = convertToJsMap(mapOf(
        "startedAt" to callLog.startedAt,
        "endedAt" to callLog.endedAt,
        "duration" to callLog.duration,
        "callId" to callLog.callId,
        "isFromServer" to callLog.isFromServer,
        "isVideoCall" to callLog.isVideoCall,
        "customItems" to callLog.customItems,
        "endResult" to callLog.endResult.asString(),
        "myRole" to callLog.myRole!!.asString(),
        "callee" to convertDirectCallUserToJsMap(callLog.callee),
        "caller" to convertDirectCallUserToJsMap(callLog.caller),
        "endedBy" to convertDirectCallUserToJsMap(callLog.endedBy),
        "users" to callLog.users.map{ convertUserToJsMap(it) },
        "endedUserId" to callLog.endedUserId,
    ))

    fun convertDirectCallUserToJsMap(callUser: DirectCallUser?) = when (callUser) {
        null -> null
        else -> {
            val user = convertUserToJsMap(callUser)
            insertMap(user, "role", callUser.role.asString())
            user
        }
    }

    fun getVideoDevice(device: VideoDevice?) = when(device) {
        null -> null
        else -> convertToJsMap(mapOf(
            "deviceId" to device.deviceName,
            "position" to device.position.asString()
        ))
    }

    fun isAppInForeground(context: Context): Boolean {
        val activityManager =
            context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val appProcesses = activityManager.runningAppProcesses ?: return false

        // Check if current activity is a background activity
        val packageName = context.packageName
        for (appProcess in appProcesses) {
            if (appProcess.importance == RunningAppProcessInfo.IMPORTANCE_FOREGROUND
                && appProcess.processName == packageName
            ) {
                val reactContext: ReactContext = try {
                    context as ReactContext
                } catch (exception: ClassCastException) {
                    // Not react context so default to true
                    return true
                }
                return reactContext.lifecycleState == LifecycleState.RESUMED
            }
        }
        return false
    }
}