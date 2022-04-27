# @sendbird/calls-react-native

ReactNative Calls SDK

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
