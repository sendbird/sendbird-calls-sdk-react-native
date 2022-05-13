# @sendbird/calls-react-native

ReactNative Calls SDK

```
├─ android/src
│  ├─ main/java/com.sendbird.calls.reactnative
│  │                                ├─ extension [Kotlin extension files]
│  │                                ├─ module [Internal calls module wrapper]
│  │                                ├─ CallsEvents.kt [Event emitter class]
│  │                                └─ CallsUtils.kt [Utility class]
│  ├─ newarch/java/com.sendbird.calls.reactnative [For turbo module, not available]
│  └─ oldarch/java/com.sendbird.calls.reactnative [For bridge module, available]
│                                   └─ RNSendbirdCallsModule.kt [External Birdge module]
├─ ios
│  ├─ Extensions [Swift extension files]
│  ├─ Helpers [Utility files]
│  ├─ Modules [Internal calls module wrapper]
│  ├─ RNSendbirdCalls.m [External ObjC Bridge module]
│  ├─ RNSendbirdCalls.swift [External Swift Bridge module]
│  └─ RNSendbirdCalls-Birdging-Header.h [Swift ObjC Bridging Header]
├─ src
│  ├─ __tests__ [Typescript tests]
│  ├─ libs [Internal calls module]
│  ├─ types [Types]
│  ├─ SendbirdCallsModule.tsx [External calls module]
│  └─ index.tsx [Export root]
└─ sample [Sample app]
```

## Installation

```sh
npm install @sendbird/calls-react-native
```

### Android
open `project/android/build.gradle` and add maven repository
```diff
allprojects {
    repositories {
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url("$rootDir/../node_modules/react-native/android")
        }
        ...
        
+       maven { url "https://repo.sendbird.com/public/maven" }
    }
}
```

## Usage

```js
import { multiply } from "@sendbird/calls-react-native";

// ...

const result = await multiply(3, 7);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
