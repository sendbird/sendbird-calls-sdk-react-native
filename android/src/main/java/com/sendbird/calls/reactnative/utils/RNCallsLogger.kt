package com.sendbird.calls.reactnative.utils

import android.util.Log
import com.sendbird.calls.SendBirdCall
import com.sendbird.calls.reactnative.module.CallsModule

internal object RNCallsLogger {
    private const val TAG = CallsModule.NAME

    internal var level = SendBirdCall.LOGGER_NONE

    fun convertLevel(lv: String): Int {
        return when(lv) {
            "none" -> SendBirdCall.LOGGER_NONE
            "error" -> SendBirdCall.LOGGER_ERROR
            "warning" -> SendBirdCall.LOGGER_WARNING
            "info" -> SendBirdCall.LOGGER_INFO
            else -> SendBirdCall.LOGGER_NONE
        }
    }

    fun setLoggerLevel(lv: String) {
        level = convertLevel(lv)
        SendBirdCall.setLoggerLevel(level)
    }

    fun d(message: String) {
        if (level != SendBirdCall.LOGGER_NONE) {
            Log.d(TAG, message)
        }
    }
}