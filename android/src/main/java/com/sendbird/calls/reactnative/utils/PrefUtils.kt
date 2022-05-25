package com.sendbird.calls.reactnative.utils

import android.content.Context
import android.content.SharedPreferences

object PrefUtils {
    private const val PREF_NAME = "sendbird.calls.reactnative"
    private const val PREF_KEY_USER_ID = "user_id"
    private const val PREF_KEY_ACCESS_TOKEN = "access_token"
    private fun getSharedPreferences(context: Context): SharedPreferences {
        return context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    }

    fun setUserId(context: Context, userId: String?) {
        val editor = getSharedPreferences(context).edit()
        editor.putString(PREF_KEY_USER_ID, userId).apply()
    }

    fun getUserId(context: Context): String? {
        return getSharedPreferences(context).getString(PREF_KEY_USER_ID, "")
    }

    fun setAccessToken(context: Context, accessToken: String?) {
        val editor = getSharedPreferences(context).edit()
        editor.putString(PREF_KEY_ACCESS_TOKEN, accessToken).apply()
    }

    fun getAccessToken(context: Context): String? {
        return getSharedPreferences(context).getString(PREF_KEY_ACCESS_TOKEN, "")
    }

}