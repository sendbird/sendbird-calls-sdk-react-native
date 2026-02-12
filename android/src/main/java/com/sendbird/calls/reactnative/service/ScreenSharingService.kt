package com.sendbird.calls.reactnative.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat

/**
 * Placeholder foreground service for Android MediaProjection.
 *
 * Android Q+ requires a foreground service with type `mediaProjection` to be running
 * before MediaProjection can be started. This service only holds the foreground notification;
 * the actual MediaProjection is managed internally by the Sendbird Calls SDK.
 *
 * The service implementation is provided by the library, but registration in AndroidManifest.xml
 * is opt-in by the app developer. Add the following to your app's AndroidManifest.xml:
 *
 * ```xml
 * <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
 * <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION" />
 *
 * <service
 *     android:name="com.sendbird.calls.reactnative.service.ScreenSharingService"
 *     android:enabled="true"
 *     android:exported="false"
 *     android:foregroundServiceType="mediaProjection" />
 * ```
 *
 * @since 1.2.0
 */
class ScreenSharingService : Service() {
    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent == null) {
            stopSelf()
            return START_NOT_STICKY
        }

        val notification = try {
            ScreenSharingServiceConfig.notificationBuilder?.invoke(this)
        } catch (e: Exception) {
            Log.w(TAG, "Custom notification builder failed, using default", e)
            null
        } ?: buildDefaultNotification()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION)
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }

        return START_NOT_STICKY
    }

    private fun getNotificationIcon(): Int {
        // Try ic_notification first, then fall back to app's default icon
        val custom = resources.getIdentifier("ic_notification", "drawable", packageName)
        if (custom != 0) return custom
        return applicationInfo.icon.takeIf { it != 0 }
            ?: android.R.drawable.ic_menu_camera
    }

    private fun buildDefaultNotification(): Notification {
        ensureChannel()
        return NotificationCompat.Builder(this, DEFAULT_CHANNEL_ID)
            .setSmallIcon(getNotificationIcon())
            .setContentTitle("Screen sharing")
            .setContentText("You are sharing your screen.")
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setOngoing(true)
            .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE)
            .build()
    }

    private fun ensureChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val manager = getSystemService(NotificationManager::class.java)
        if (manager.getNotificationChannel(DEFAULT_CHANNEL_ID) != null) return
        val channel = NotificationChannel(
            DEFAULT_CHANNEL_ID,
            "Screen Sharing",
            NotificationManager.IMPORTANCE_LOW
        )
        manager.createNotificationChannel(channel)
    }

    companion object {
        private const val TAG = "ScreenSharingService"
        private const val DEFAULT_CHANNEL_ID = "sendbird_calls_screen_sharing"
        private const val NOTIFICATION_ID = 440_983_927

        fun launch(context: Context): Boolean {
            val intent = Intent(context, ScreenSharingService::class.java)
            return try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    context.startForegroundService(intent)
                } else {
                    context.startService(intent)
                }
                true
            } catch (e: RuntimeException) {
                Log.w(TAG, "Service not started", e)
                false
            }
        }

        fun stop(context: Context) {
            context.stopService(Intent(context, ScreenSharingService::class.java))
        }
    }
}
