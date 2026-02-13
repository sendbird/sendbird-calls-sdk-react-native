package com.sendbird.calls.reactnative.service

import android.app.Notification
import android.content.Context

/**
 * Configuration for the screen sharing foreground service notification.
 *
 * Set [notificationBuilder] in your `MainApplication.onCreate()` to customize
 * the notification shown during screen sharing. If not set, a default notification
 * will be used.
 *
 * Example:
 * ```kotlin
 * // In MainApplication.onCreate()
 * ScreenSharingServiceConfig.notificationBuilder = { context ->
 *     NotificationCompat.Builder(context, "my_channel_id")
 *         .setContentTitle("My App Screen Sharing")
 *         .setSmallIcon(R.drawable.my_icon)
 *         .build()
 * }
 * ```
 *
 * @since 1.2.0
 */
object ScreenSharingServiceConfig {
    var notificationBuilder: ((Context) -> Notification)? = null
}
