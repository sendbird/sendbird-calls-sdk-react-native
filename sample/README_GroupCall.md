# This is a sample for Call SDK development

Please check our official quickstart from here: https://github.com/sendbird/sendbird-calls-groupcall-quickstart-react-native

---

# Sendbird Calls for React-Native Quickstart

![Platform](https://img.shields.io/badge/platform-React--Native-black.svg)
![Languages](https://img.shields.io/badge/language-Typescript-blue.svg)

## Introduction

Sendbird Calls SDK for React-Native is used to initialize, configure, and build voice and video calling functionality into your React-Native client app. In this repository, you will find the steps you need to take before implementing the Calls SDK into a project, and a sample app which contains the code for implementing voice and video call.

### More about Sendbird Calls for React-Native

Find out more about Sendbird Calls for React-Native on Calls for React-Native doc. If you need any help in resolving any issues or have questions, visit [our community](https://community.sendbird.com).

<br />

## Before getting started

This section shows you the prerequisites you need for testing Sendbird Calls for React-Native sample app.

### Requirements

The minimum requirements for Calls SDK for React-Native sample are:

- React-Native 0.60 +
- yarn or npm
- Xcode
- Android Studio
- Physical device (Android 21+, iOS 11+)

For more details on **installing and configuring the Calls SDK for React-Native**, refer to Calls for React-Native doc.

### Environment setup

Install dependencies (`node_modules` and `Pods`)

```shell
$ yarn install
$ npx pod-install
```

<br />

## Getting started

If you would like to try the sample app specifically fit to your usage, you can do so by following the steps below.

### Create a Sendbird application

1. Login or Sign-up for an account on [Sendbird Dashboard](https://dashboard.sendbird.com).
2. Create or select a calls-enabled application on the dashboard.
3. Note your Sendbird application ID for future reference.

### Create test users

1. On the Sendbird dashboard, navigate to the **Users** menu.
2. Create at least two new users.
3. Note the `user_id` of each user for future reference.

### Specify the Application ID

To run the sample React-Native app on the Sendbird application specified earlier, your Sendbird application ID must be specified. On the sample client app’s source code, replace `SAMPLE_APP_ID` with `APP_ID` which you can find on your Sendbird application information.

```ts
SendbirdCalls.initialize('SAMPLE_APP_ID');
```

### Build and run the sample app

1. Open IDE (Xcode or Android Studio)
2. Build and run the sample app on your device.
3. Install the application onto at least two separate devices for each test user you created earlier.
4. If two devices are available, repeat these steps to install the sample app on each device.

<br />

## Making your first group call

### How to make a group call

1. Log in to the sample app on one of the prepared devices with the `user_id` of one of the created users.
2. Log in to the sample app on another device using another `user_id` of the user.
3. On one of the devices, create a room and check the `room_id` of the created room.
4. On the other device, enter the room using the `room_id` checked before.
5. If the two testing devices are near each other, use headphones to make a call to prevent audio feedback.

### preview video view before entering a room

In the sample, [react-native-camera-kit](https://github.com/teslamotors/react-native-camera-kit) is used to create a preview on the screen before entering the room. You can check how the view looks on the screen when muting or unmuting audio and when turning the video on or off.

> **NOTE**: The camera library doesn't matter if you use another library.

<br />

## Reference

For further detail on Sendbird Calls for React-Native, refer to Sendbird Calls SDK for React-Native README.

<br />
