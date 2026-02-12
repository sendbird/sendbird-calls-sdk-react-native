# iOS Broadcast Upload Extension Guide

This guide explains how to set up the Broadcast Upload Extension for screen sharing. The extension enables screen sharing to continue even when the app is in the background — similar to how Android uses `ScreenSharingService` for MediaProjection.

**No JS API changes are required.** `call.startScreenShare()` automatically uses the broadcast extension when configured.

## How it works

| Configuration | Behavior |
|---|---|
| `appGroupIdentifier = nil` (default) | In-app capture via `RPScreenRecorder.startCapture` |
| `appGroupIdentifier` set | Broadcast Extension via `RPSystemBroadcastPickerView` |

### Architecture

```
Main App Process
  startScreenShare()
       │
  ScreenShareManager
       ├─ appGroupIdentifier == nil → RPScreenRecorder (in-app, foreground only)
       └─ appGroupIdentifier != nil → Socket Server + RPSystemBroadcastPickerView
                                          │
                                    UNIX Domain Socket
                                          │
Extension Process
  RNSBScreenShareBroadcastHandler
       └─ Receives CMSampleBuffer from system → sends frames via socket
```

## Setup

### 1. Add Broadcast Upload Extension target

In Xcode:

1. File → New → Target → **Broadcast Upload Extension**
2. Name it (e.g., `BroadcastExtension`), uncheck "Include UI Extension"
3. Set deployment target to match your main app
4. Replace the auto-generated `SampleHandler.swift` contents in step 3

> **CocoaPods compatibility (Xcode 16+):**
> Xcode 16+ creates targets using `PBXFileSystemSynchronizedRootGroup` and `objectVersion = 70` in `project.pbxproj`, which CocoaPods does not support. After creating the target, you must manually edit `project.pbxproj`:
>
> 1. Change `objectVersion` from `70` to `54`
> 2. Replace the `PBXFileSystemSynchronizedRootGroup` and `PBXFileSystemSynchronizedBuildFileExceptionSet` sections with a traditional `PBXGroup` containing explicit `PBXFileReference` entries for each file (e.g., `SampleHandler.swift`, `Info.plist`, entitlements)
> 3. Add the source files to the extension's `PBXSourcesBuildPhase`
> 4. Remove `fileSystemSynchronizedGroups` from the `PBXNativeTarget`
>
> Without these changes, `pod install` will fail with `Unknown ISA PBXFileSystemSynchronizedRootGroup` or `Unknown object version (70)`.

### 2. Configure App Groups

Both the main app and the extension must share the same App Group.

1. Select main app target → Signing & Capabilities → **+ Capability** → App Groups
2. Add a group identifier (e.g., `group.com.yourapp.screenshare`)
3. Select extension target → repeat the same steps with the same group identifier

### 3. Create SampleHandler in the extension

```swift
// BroadcastExtension/SampleHandler.swift
import sendbird_calls_react_native

class SampleHandler: RNSBScreenShareBroadcastHandler {
    override var appGroupIdentifier: String {
        "group.com.yourapp.screenshare"  // Must match the App Group from step 2
    }
}
```

### 4. Configure the main app

In `AppDelegate.swift`, set the config before any calls are made:

```swift
import sendbird_calls_react_native

func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
) -> Bool {
    // Configure Broadcast Extension for screen sharing
    RNSBScreenSharingServiceConfig.appGroupIdentifier = "group.com.yourapp.screenshare"
    RNSBScreenSharingServiceConfig.extensionBundleIdentifier = "com.yourapp.broadcast-extension"

    // ... rest of setup
}
```

### 5. Update Podfile

```ruby
target 'YourApp' do
  pod 'sendbird-calls-react-native'  # Core (default)
end

target 'BroadcastExtension' do
  use_frameworks! :linkage => :static
  pod 'sendbird-calls-react-native/Broadcast'
end
```

Then run `pod install`.

### 6. Use from JavaScript (no changes needed)

```ts
// Automatically uses broadcast extension if configured, otherwise in-app capture
await call.startScreenShare();
await call.stopScreenShare();
```

## Podspec subspecs

| Subspec | Included in | Contents |
|---|---|---|
| `Core` (default) | Main app | All source files + `SocketConnection`, `BroadcastScreenCapturer`, `RNSBScreenSharingServiceConfig` |
| `Broadcast` | Extension | `RNSBScreenShareBroadcastHandler` + `SocketConnection` (no React dependency) |

## Troubleshooting

### Extension fails to connect

- Verify both targets use the **same** App Group identifier
- Ensure `startScreenShare()` is called before the user taps the broadcast picker
- The main app must be running (socket server starts on `startScreenShare()`)

### Screen share stops when app backgrounds (without extension)

This is expected with in-app capture (`RPScreenRecorder`). Set up the broadcast extension to enable background screen sharing.

### "No such module" build error for extension

- Run `pod install` after updating the Podfile
- Ensure the extension target in Podfile matches the Xcode target name exactly
