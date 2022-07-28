# Sendbird GroupCall Internal

## Setting `APP_ID` and Call type

To specify APP_ID and change the Call type which is whether is DirectCall or GroupCall, you must copy `env.sample.ts` to create `env.ts` file and then enter `APP_ID` and `INITIAL_ROUTE` you want to run

```typescript
export const APP_ID = '<APP_ID>';
export const INITIAL_ROUTE: 'group-call' | 'direct-call' = 'group-call';
```

<br />

## Install packages

You have to install dependencies before starting the project. (`node_modules` and `Pods`)

```shell
$ npm install
$ npx pod-install
```

_NOTE : The below libraries were installed for GroupCall._

- [react-navigation](https://reactnavigation.org/)
- [react-native-camera-kit](https://github.com/teslamotors/react-native-camera-kit)

<br />

## File Structure

- assets : manage images are used in the project
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
