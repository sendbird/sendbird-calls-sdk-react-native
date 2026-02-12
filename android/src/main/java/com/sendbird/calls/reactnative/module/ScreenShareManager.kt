package com.sendbird.calls.reactnative.module

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.media.projection.MediaProjectionManager
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.sendbird.calls.SendBirdError
import com.sendbird.calls.SendBirdException
import com.sendbird.calls.reactnative.RNCallsInternalError
import com.sendbird.calls.reactnative.extension.rejectCalls
import com.sendbird.calls.reactnative.service.ScreenSharingService
import com.sendbird.calls.reactnative.utils.RNCallsLogger

class ScreenShareManager(private val reactContext: ReactApplicationContext) {
    private var pendingPromise: Promise? = null
    private var pendingConnect: ((Intent) -> Unit)? = null

    companion object {
        private const val SCREEN_SHARE_REQUEST_CODE = 79264

        // Error codes from SendbirdError.ts not defined in SendBirdError
        private const val ERR_NOT_SUPPORTED_APP_STATE_FOR_SCREEN_SHARE = 1800627
        private const val ERR_PERMISSION_DENIED_FOR_SCREEN_SHARE = 1800628
    }

    private val activityEventListener = object : BaseActivityEventListener() {
        override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
            if (requestCode != SCREEN_SHARE_REQUEST_CODE) return

            val promise = pendingPromise
            val connect = pendingConnect
            pendingPromise = null
            pendingConnect = null

            if (promise == null || connect == null) return

            if (resultCode == Activity.RESULT_OK && data != null) {
                connect(data)
            } else {
                cleanup()
                promise.rejectCalls(SendBirdException(
                    "[directCall/startScreenShare] User denied screen share permission",
                    ERR_PERMISSION_DENIED_FOR_SCREEN_SHARE
                ))
            }
        }
    }

    init {
        reactContext.addActivityEventListener(activityEventListener)
    }

    fun start(promise: Promise, onPermissionGranted: (Intent) -> Unit) {
        val from = "directCall/startScreenShare"
        RNCallsLogger.d("[ScreenShareManager] start()")

        if (pendingPromise != null) {
            promise.rejectCalls(SendBirdException(
                "[$from] Screen share is already in progress",
                SendBirdError.ERR_SCREEN_SHARE_ALREADY_IN_PROGRESS
            ))
            return
        }

        val activity = reactContext.currentActivity
        if (activity == null) {
            promise.rejectCalls(SendBirdException(
                "[$from] No activity available for screen share",
                ERR_NOT_SUPPORTED_APP_STATE_FOR_SCREEN_SHARE
            ))
            return
        }

        this.pendingPromise = promise
        this.pendingConnect = onPermissionGranted

        if (!ScreenSharingService.launch(reactContext)) {
            cleanup()
            promise.reject(RNCallsInternalError(from, RNCallsInternalError.Type.SCREEN_SHARE_SERVICE_FAILED))
            return
        }

        val mpm = activity.getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
        activity.startActivityForResult(mpm.createScreenCaptureIntent(), SCREEN_SHARE_REQUEST_CODE)
    }

    fun cleanup() {
        pendingPromise = null
        pendingConnect = null
        ScreenSharingService.stop(reactContext)
    }

    fun dispose() {
        reactContext.removeActivityEventListener(activityEventListener)
        cleanup()
    }
}
