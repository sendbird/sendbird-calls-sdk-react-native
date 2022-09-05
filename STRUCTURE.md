# Internal Guide

<br />

## React Native Sample

<br />

### Install packages

You have to install dependencies before starting the project. (`node_modules` and `Pods`)

```shell
$ npm install
$ npx pod-install
```

<br />

### Setting `APP_ID` and Call type

To specify APP_ID and change the Call type which is whether is DirectCall or GroupCall, you must copy `env.sample.ts` to create `env.ts` file and then enter `APP_ID` and `INITIAL_ROUTE` you want to run

```ts
export const APP_ID = '<APP_ID>';
export const INITIAL_ROUTE: 'group-call' | 'direct-call' = 'group-call';
```

<br />

### File Structure

- assets
- direct-call : `DirectCall` files
- group-call : `GroupCall` files
- shared: shared files

```
 📂 src
 ┣ 📂 assets
 ┣ 📂 direct-call
 ┃ ┣ 📂 callHander
 ┃ ┣ 📂 components
 ┃ ┣ 📂 hooks
 ┃ ┣ 📂 navigations
 ┃ ┣ 📂 screens
 ┃ ┗ App.tsx
 ┣ 📂 group-call
 ┃ ┣ 📂 components
 ┃ ┣ 📂 hooks
 ┃ ┣ 📂 navigations
 ┃ ┣ 📂 screens
 ┃ ┗ App.tsx
 ┗ 📂 shared
   ┣ 📂 components
   ┣ 📂 contexts
   ┣ 📂 hooks
   ┣ 📂 libs
   ┣ 📂 styles
   ┣ 📂 types
   ┣ 📂 utiles
   ┗ constants.ts
```

<br />

## React Native Lib

<br />

### File Structure

```
 📂 src
 ┣ 📂 libs
 ┣ 📂 types
 ┣ 📂 utils
 ┗ index.ts
```

<br />

### Docs

Please check the below link.  
[/docs/index.html](/docs/index.html)

<br />

## Android

_NOTE : Please check the [Android Native Modules](https://reactnative.dev/docs/native-modules-android) guide in the official React Native document._

### File Structure

```
 📂 src
 ┣ 📂 main
 ┃ ┣ 📂 extension
 ┃ ┣ 📂 module
 ┃ ┃ ┣ 📂 listener
 ┃ ┃ ┗ CallsModule
 ┃ ┣ 📂 utils
 ┃ ┣ 📂 view
 ┃ ┗ RNSBGroupCallVideoViewManager
 ┗ 📂 oldarch
   ┗ RNSendbirdCallsModule
```

<br />

## iOS

_NOTE : Please check the [iOS Native Modules](https://reactnative.dev/docs/native-modules-ios) guide in the official React Native document._

### File Structure

```
 📂 RNSendbirdCalls
 ┣ 📂 views
 ┣ 📂 extensions
 ┣ 📂 Helpers
 ┣ 📂 Modules
 ┃ ┗ CallsModule.swift
 ┣ RNSendbirdCalls.swift
 ┣ RNSendbirdCalls.m
 ┣ RNSBGroupCallVideoViewManager.swift
 ┗ RNSBGroupCallVideoViewManager.m
```
