# Android Screen Share Guide

Android screen sharing uses `MediaProjection` with a foreground service. The OS requires a foreground notification to be displayed while screen sharing is active.

## How it works

```
startScreenShare()
     │
     v
ScreenShareManager
     │
     ├─ 1. Launch ScreenSharingService (foreground notification)
     ├─ 2. Request MediaProjection permission (system dialog)
     ├─ 3. User grants permission
     │      ├─ Pass intent to SDK → directCall.startScreenShare()
     │      └─ onLocalVideoSettingsChanged event fired to JS
     └─ 4. User denies permission
            └─ Stop service, reject promise

stopScreenShare()
     │
     v
SDK directCall.stopScreenShare()
     ├─ Stop ScreenSharingService
     ├─ onLocalVideoSettingsChanged event fired to JS
     └─ Promise resolved
```

- Android requires a foreground service with `mediaProjection` type to use MediaProjection. This is originally the app developer's responsibility, but the RN SDK provides `ScreenSharingService` as a convenience default implementation.
- Permission dialog is shown every time (Android does not persist MediaProjection grants).
- Automatic cleanup on call end.

## Setup

### 1. Add permissions and service to AndroidManifest.xml

```xml
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION" />

<application>
  <service
    android:name="com.sendbird.calls.reactnative.service.ScreenSharingService"
    android:enabled="true"
    android:exported="false"
    android:foregroundServiceType="mediaProjection" />
</application>
```

The service is **not** declared in the library manifest — apps must explicitly register it.

### 2. (Optional) Customize the foreground notification

By default, a minimal "Screen sharing" notification is shown (importance: LOW).

To customize, set `ScreenSharingServiceConfig.notificationBuilder` in `MainApplication.onCreate()`:

```kotlin
import com.sendbird.calls.reactnative.service.ScreenSharingServiceConfig

class MainApplication : Application(), ReactApplication {
    override fun onCreate() {
        super.onCreate()

        // Customize screen sharing notification
        ScreenSharingServiceConfig.notificationBuilder = { context ->
            NotificationCompat.Builder(context, "my_channel_id")
                .setSmallIcon(R.drawable.my_icon)
                .setContentTitle("My App - Screen Sharing")
                .setContentText("You are sharing your screen.")
                .build()
        }

        // ...
    }
}
```

Default notification icon resolution order:
1. Custom `ic_notification` drawable
2. App's default icon (`applicationInfo.icon`)
3. `android.R.drawable.ic_menu_camera` (fallback)

### 3. Use from JavaScript

```ts
await call.startScreenShare();
await call.stopScreenShare();
```

## File structure

```
android/src/main/java/com/sendbird/calls/reactnative/
├── module/
│   ├── CallsDirectCallModule.kt     # RN bridge entry point (startScreenShare/stopScreenShare)
│   └── ScreenShareManager.kt        # Permission flow + service lifecycle
└── service/
    ├── ScreenSharingService.kt       # Foreground service (notification holder)
    └── ScreenSharingServiceConfig.kt # Notification customization config
```

## Troubleshooting

### Permission denied on every attempt

This is expected. Android does not persist MediaProjection permission — the system dialog appears every time `startScreenShare()` is called.

### App crashes or goes silent after ~3 minutes during a call

Android 14+ classifies foreground services as short-lived or long-lived based on their `foregroundServiceType`.
Short-lived services have a ~3 minute timeout, after which the OS terminates resource access (mic, camera, etc.), causing ANR or audio loss.

Make sure all foreground services in your app declare the appropriate type.
See [Foreground service types](https://developer.android.com/develop/background-work/services/fg-service-types) for details.

### Notification not showing / service crash

- Verify `FOREGROUND_SERVICE` and `FOREGROUND_SERVICE_MEDIA_PROJECTION` permissions are declared
- Verify the `<service>` element is present in AndroidManifest.xml with `foregroundServiceType="mediaProjection"`
- On Android 14+, foreground service type must be declared both in manifest and at runtime
