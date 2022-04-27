package com.sendbird.calls.reactnative

import com.facebook.react.bridge.*
import com.sendbird.calls.SendBirdException
import com.sendbird.calls.User

class CallsUtils {
    companion object {
        /** Error utils **/
        // TODO: convert sendbird exception to javascript readable error

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
            is Int -> jsMap.putInt(key, value)

            is Map<*, *> -> jsMap.putMap(key, convertToJavascriptMap(value))
            is Array<*> -> jsMap.putArray(key, convertToJavascriptArray(value))
            else -> {
                if(value == null) jsMap.putNull(key)
                else throw Error("Unknown type")
            }
        }
        fun insertArr(jsArr: WritableArray, value: Any?) = when (value) {
            is Boolean -> jsArr.pushBoolean(value)
            is String -> jsArr.pushString(value)
            is Double -> jsArr.pushDouble(value)
            is Int -> jsArr.pushInt(value)

            is Map<*, *> -> jsArr.pushMap(convertToJavascriptMap(value))
            is Array<*> -> jsArr.pushArray(convertToJavascriptArray(value))
            else -> {
                if(value == null) jsArr.pushNull()
                else throw Error("Unknown type")
            }
        }
        fun convertToJavascriptMap(nativeMap: Map<*, *>): WritableNativeMap {
            val jsMap = WritableNativeMap()
            val keyIterator = nativeMap.keys.iterator();
            while(keyIterator.hasNext()) {
                val key = keyIterator.next()
                val value = nativeMap.get(key)
                if(key is String) insertMap(jsMap, key, value)
            }
            return jsMap
        }
        fun convertToJavascriptArray(nativeArr: Array<*>): WritableNativeArray {
            val jsArr = WritableNativeArray()
            val iterator = nativeArr.iterator()
            while (iterator.hasNext()) {
                val value = iterator.next()
                insertArr(jsArr, value)
            }
            return jsArr
        }
        fun convertUserToJavascriptMap(user: User): WritableNativeMap {
            val userMap = WritableNativeMap();
            insertMap(userMap, "userId", user.userId)
            insertMap(userMap, "isActive", user.isActive)
            insertMap(userMap, "nickname", user.nickname)
            insertMap(userMap, "metaData", user.metaData)
            insertMap(userMap, "profileUrl", user.profileUrl)
            return userMap
        }
    }
}
