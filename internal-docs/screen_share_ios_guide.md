# iOS Screen Share Guide

iOS supports two screen sharing modes. The mode is selected automatically based on configuration.

| Configuration | Mode | Behavior |
|---|---|---|
| `appGroupIdentifier = nil` (default) | In-app | `RPScreenRecorder.startCapture` |
| `appGroupIdentifier` set | Broadcast | `RPSystemBroadcastPickerView` + Extension |

## In-app mode (default)

No native setup required. Works out of the box.

- Uses `RPScreenRecorder.startCapture` to capture the screen within the app process
- System permission dialog is shown on first use
- **Foreground only** — screen share stops when the app goes to background
- Promise resolves after SDK connection + capture start completes

This is the simplest option, suitable for apps that don't need background screen sharing.

## Broadcast mode

Requires a Broadcast Upload Extension target. Enables **background screen sharing** — the capture continues even when the app is not in the foreground, similar to how Android uses `ScreenSharingService` for MediaProjection.

### Architecture

**Extension is master, App is follower.** The broadcast picker is the only user-facing control point for both start and stop. Extension lifecycle events drive all state transitions — the app simply reacts.

```
┌─────────────────────────────────┐     ┌────────────────────────────┐
│  Main App Process               │     │  Extension Process         │
│                                 │     │  RNSBScreenShareBroadcastHandler
│  CallsDirectCallModule          │     │  (NO state logic)          │
│   startScreenShare() ─┐         │     └──────────┬─────────────────┘
│   stopScreenShare() ──┤         │                │ Unix Domain Socket
│                       v         │                v
│  ScreenShareManager             │     BroadcastScreenCapturer
│   ├─ In-app mode                │      (socket server + picker)
│   │   └─ RPScreenRecorder       │
│   └─ Broadcast mode             │     Delegate events:
│       └─ BroadcastContext       │       capturerDidStart
│           (state machine)       │       capturer(didReceiveVideoFrame:)
│                                 │       capturerDidFinish
│  State transitions:             │       capturer(didFailWithError:)
│   idle → awaitingExtension      │
│        → connectingSDK          │
│        → active(bufferHandler)  │
└─────────────────────────────────┘
```

### Flow

**Start:**
1. `startScreenShare()` → setup capturer + show picker → **Promise resolves immediately**
2. User selects extension in picker → extension connects via socket
3. `capturerDidStart` delegate → SDK `directCall.startScreenShare()` → `active` state
4. `onLocalVideoSettingsChanged` event fired to JS

**Stop:**
1. `stopScreenShare()` → show picker → **Promise resolves immediately**
2. User stops broadcast in picker → extension disconnects
3. `capturerDidFinish` delegate → SDK `directCall.stopScreenShare()` → `idle` state
4. `onLocalVideoSettingsChanged` event fired to JS

**Call ends while broadcasting:**
1. `didEnd()` → `screenShareManager.cleanup(reason:)` → capturer sends shutdown signal with reason via socket
2. Extension reads reason from signal file → `finishBroadcastWithError("The call has ended")`

### Setup

#### 1. Add Broadcast Upload Extension target

In Xcode:

1. File → New → Target → **Broadcast Upload Extension**
2. Name it (e.g., `BroadcastExtension`), uncheck "Include UI Extension"
3. Set deployment target to match your main app
4. Replace the auto-generated `SampleHandler.swift` with the code below (step 3)

> **CocoaPods compatibility (Xcode 16+):**
> Xcode 16+ creates targets using `PBXFileSystemSynchronizedRootGroup` and `objectVersion = 70` in `project.pbxproj`, which CocoaPods does not support. After creating the target, you must manually edit `project.pbxproj`:
>
> 1. Change `objectVersion` from `70` to `54`
> 2. Replace the `PBXFileSystemSynchronizedRootGroup` and `PBXFileSystemSynchronizedBuildFileExceptionSet` sections with a traditional `PBXGroup` containing explicit `PBXFileReference` entries for each file (e.g., `SampleHandler.swift`, `Info.plist`, entitlements)
> 3. Add the source files to the extension's `PBXSourcesBuildPhase`
> 4. Remove `fileSystemSynchronizedGroups` from the `PBXNativeTarget`
>
> Without these changes, `pod install` will fail with `Unknown ISA PBXFileSystemSynchronizedRootGroup` or `Unknown object version (70)`.

#### 2. Configure App Groups

Both the main app and the extension must share the same App Group.

1. Select main app target → Signing & Capabilities → **+ Capability** → App Groups
2. Add a group identifier (e.g., `group.com.yourapp.screenshare`)
3. Select extension target → repeat the same steps with the same group identifier

#### 3. Create SampleHandler in the extension

```swift
// BroadcastExtension/SampleHandler.swift
import sendbird_calls_react_native

class SampleHandler: RNSBScreenShareBroadcastHandler {
    override var appGroupIdentifier: String {
        "group.com.yourapp.screenshare"  // Must match the App Group from step 2
    }
}
```

#### 4. Configure the main app

In `AppDelegate.swift`, set the config before any calls are made:

```swift
import sendbird_calls_react_native

class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        // Configure Broadcast Extension for screen sharing
        RNSBScreenSharingServiceConfig.appGroupIdentifier = "group.com.yourapp.screenshare"
        RNSBScreenSharingServiceConfig.extensionBundleIdentifier = "com.yourapp.broadcast-extension"

        // ...
    }
}
```

#### 5. Update Podfile

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

#### 6. Use from JavaScript

```ts
// Automatically uses broadcast extension if configured, otherwise in-app capture
await call.startScreenShare();
await call.stopScreenShare();
```

## Podspec subspecs

| Subspec            | Included in | Contents                                                         |
|--------------------|-------------|------------------------------------------------------------------|
| `Core` (default)   | Main app    | All source files including `BroadcastScreenCapturer`, `SocketConnection`, config |
| `Broadcast`        | Extension   | `RNSBScreenShareBroadcastHandler` + `SocketConnection` only (framework: ReplayKit) |

## File structure

```
ios/
├── Modules/
│   └── CallsModule+DirectCall.swift          # RN bridge entry point (startScreenShare/stopScreenShare)
└── ScreenShare/
    ├── ScreenShareManager.swift              # Public API + mode dispatch (broadcast vs in-app)
    ├── ScreenShareManager+Broadcast.swift    # BroadcastContext + broadcast lifecycle
    ├── ScreenShareManager+InApp.swift        # RPScreenRecorder capture
    └── Broadcast/
        ├── BroadcastScreenShareDelegate.swift  # State enum + delegate protocol
        ├── BroadcastScreenCapturer.swift        # Socket server + picker (Core subspec)
        ├── SocketConnection.swift               # Unix domain socket (shared by both subspecs)
        └── RNSBScreenShareBroadcastHandler.swift # Extension entry point (Broadcast subspec only)
```

## Troubleshooting

### Extension fails to connect

- Verify both targets use the **same** App Group identifier
- Ensure `startScreenShare()` is called before the user taps the broadcast picker
- The main app must be running (socket server starts on `startScreenShare()`)

### User dismisses picker without selecting

Nothing happens — the socket server keeps listening. Next `startScreenShare()` call will show the picker again.

### Screen share stops when app backgrounds (without extension)

This is expected with in-app capture (`RPScreenRecorder`). Set up the broadcast extension to enable background screen sharing.

### "No such module" build error for extension

- Run `pod install` after updating the Podfile
- Ensure the extension target in Podfile matches the Xcode target name exactly

### Debugging the Broadcast Extension

The extension runs in a **separate process**, so Xcode's debugger and console do not show its logs by default. Use macOS **Console.app** instead:

1. Open **Console.app** (`/Applications/Utilities/Console.app`)
2. Connect your iOS device via USB and select it in the sidebar
3. Click **Start Streaming** to begin capturing logs
4. Filter by `SBCBroadcast` to see only broadcast extension logs (all log messages are prefixed with `[SBCBroadcast]`)

This is the most reliable way to trace socket connection, frame sending, and shutdown behavior in the extension process.
