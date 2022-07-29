## Making your first group call

Follow the step-by-step instructions below to authenticate and make your first group call.

### Step 1: Initialize the SendbirdCall instance in a client app

As shown below, the `SendbirdCalls` instance must be initiated when a client app is launched.
Initialize the `SendbirdCalls` instance with the `APP_ID` of the Sendbird application you would like to use to make a call.

```ts
import { SendbirdCalls } from '@sendbird/calls-react-native';

SendbirdCalls.initialize(APP_ID);
```

> Note: If another initialization with another `APP_ID` takes place, all existing data in the app will be deleted and the `SendbirdCalls` instance will be initialized with the new `APP_ID`.

### Step 2: Authenticate a user

In order to participate in the group calls, authenticate the user with SendBird server with the `SendbirdCalls.authenticate()` method.

```ts
import { SendbirdCalls } from '@sendbird/calls-react-native';

// Authenticate
SendbirdCalls.authenticate(USER_ID, ACCESS_TOKEN)
  .then((user) => {
    // The user has been authenticated successfully
  })
  .catch((error) => {
    // error
  });
```

### Step 3: Create a room

By calling the `SendbirdCalls.createRoom()` by passing `SMALL_ROOM_FOR_VIDEO` as the parameter, you can create a room for up to 6 participants to make a video call. When a room is created, the status of the room becomes `OPEN` and `ROOM_ID` is generated.

```ts
const room = await SendbirdCalls.createRoom(SendbirdCalls.RoomType.SMALL_ROOM_FOR_VIDEO);
```

> **Note**: Share the room ID with other users for them to enter the room from the client app.

### Step 4: Enter a room

A user can search a room with a specific `ROOM_ID` to participate in a group call at any time.

#### - retrieve a room instance

To enter a room, you must first acquire the room instance from Sendbird server with the room ID. To fetch the most up-to-date room instance from Sendbird server, use the `SendbirdCalls.fetchRoomById()` method. Also, you can use the `SendbirdCalls.getCachedRoomById()` method that returns the most recently cached room instance from Sendbird Calls SDK.

```ts
// get room instance using ROOM_ID
const room = await SendbirdCalls.fetchRoomById(ROOM_ID);

// get cached room instance using ROOM_ID
const room = await SendbirdCalls.getCachedRoomById(ROOM_ID);
```

#### - enter a room

Once the room is retrieved, call the `enter()` method to enter the room. An object that sets whether to use video and audio is passed to `enter()` as a parameter. If no parameters are passed, both audio and video are enabled as default.

When a user enters a room, a participant is created with a unique `participant ID` to represent the user in the room.

If you create a room using `SendbirdCalls.createRoom()`, you can use the returned room instance without needing to get a room instance.

```ts
const enterParams: EnterParams = {
    audioEnabled: true,
    videoEnabled: true,
}
await room.enter(enterParams)
```

> **NOTE**: If there is no room whose ID is room ID passed as a parameter among the cached room instances, `SendbirdCalls.getCachedRoomById()` returns `null`. So you should need to check the returned value before calling `enter()`.

### Step 5: Handle events in a room

A user can receive events of a room that they are currently participating. Users will be notified when other participants enter or leave the room, change their media settings, or when the room is deleted.

#### - Add event listener

Add an event listener for the user to receive events that occur in a room that the user joins as a participant.

```ts
const unsubscribe = room.addListener({
  onRemoteParticipantEntered: (participant: Participant) => {},

  onRemoteParticipantExited: (participant: Participant) => {},

  onRemoteParticipantStreamStarted: (participant: Participant) => {},

  onRemoteVideoSettingsChanged: (participant: Participant) => {},

  onRemoteAudioSettingsChanged: (participant: Participant) => {},

  onAudioDeviceChanged: (info: AudioDeviceChangedInfo) => {},

  onCustomItemsUpdated: (updatedKeys: string[]) => {},

  onCustomItemsDeleted: (deletedKeys: string[]) => {},

  onDeleted: () => {},

  onError: (e: SendbirdError, participant: Participant | null) => {},
});

unsubscribe();
```

> **NOTE** Don't forget to remove the listener.
> For example, you can call `unsubscribe()` from clean-up of `useEffect`.

<br/>

| Method                             | Invocation criteria                                                             |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| onRemoteParticipantEntered()       | Invoked when a remote participant has entered a room.                           |
| onRemoteParticipantExited()        | Invoked when a remote participant has exited a room.                            |
| onRemoteParticipantStreamStarted() | Invoked when a remote participant has started media streaming.                  |
| onRemoteVideoSettingsChanged()     | Invoked when a remote participant's video settings have changed.                |
| onRemoteAudioSettingsChanged()     | Invoked when a remote participant's audio settings have changed.                |
| onAudioDeviceChanged()             | Invoked when the audio device used in the call has changed.                     |
| onCustomItemsUpdated()             | Invoked when one or more of `Room`’s custom items (metadata) have been updated. |
| onCustomItemsDeleted()             | Invoked when one or more of `Room`’s custom items (metadata) have been deleted. |
| onDeleted()                        | Invoked when `Room` is deleted.                                                 |
| onError()                          | Invoked when a participant stream is lost due to reconnection failure.          |

<br />

### Step 6: Exit a room

To leave a room, call `exit()`. On the room handlers of the remaining participants, the `onRemoteParticipantExited()` method will be called.

```ts
room.exit();
```

<br />

## Implementation guide

### Create a room

A room is a must to use a **Group calls** to talk to multiple people. You can create a new room using `SendbirdCalls.createRoom()`. Once the room is created, you must use `enter()` to enter the room. And then you have to share the `ROOM_ID` of the room with other users in order for other participants can enter the room.

```ts
const room = await SendbirdCalls.createRoom(SendbirdCalls.RoomType.SMALL_ROOM_FOR_VIDEO);
await room.enter();
```

### Handle events in a room

A user can receive events of a room that they are currently participating. Users will be notified when other participants enter or leave the room, change their media settings, or when the room is deleted.

You don't need to define all events method, you just need to define the methods you want to implement. And, don't forget to remove the listener. For example, you can call `unsubscribe()` from clean-up of `useEffect`.

```tsx
useEffect(() => {
  const unsubscribe = room.addListener({
    onRemoteParticipantEntered: (participant: Participant) => {},

    onRemoteParticipantExited: (participant: Participant) => {},

    onRemoteParticipantStreamStarted: (participant: Participant) => {},

    ...
  });

  return unsubscribe();
}, []);
```

### Enter a room

Use `SendbirdCalls.fetchRoomById()` with `ROOM_ID` to get the room instance you want to enter. Or, if you have fetched the room before, you can use `SendbirdCalls.getCachedRoomById()` to get a cached room instance. Then call the `enter()` method to enter the room.

When a user enters a room, a participant is created with a unique `participant ID` to represent the user in the room. When the remote user enters the room, the `onRemoteParticipantEntered()` listener method is called. And then when the participant has started media streaming, `onRemoteParticipantStreamStarted()` listener method is called.

> **NOTE**: If there is no room whose ID is room ID passed as a parameter among the cached room instances, `SendbirdCalls.getCachedRoomById()` returns `null`. So you should need to check the returned value.

```ts
// get room instance using ROOM_ID
const room = await SendbirdCalls.fetchRoomById(ROOM_ID);
await room.enter()

// get cached room instance using ROOM_ID
const room = await SendbirdCalls.getCachedRoomById(ROOM_ID);
await room?.enter()

// receives the event
room.addListener({
  onRemoteParticipantEntered: (participant: Participant) => {
    // the remote participant entered the room
  },

  onRemoteParticipantStreamStarted: (participant: Participant) => {
    // the remote participant has started media streaming
  },

  ...
});
```

### Handle a current call

Participants can mute or unmute their microphones using the `room.localParticipant.muteMicrophone()` or `room.localParticipant.unmuteMicrophone()` methods.
`onRemoteAudioSettingsChanged()` listener method is invoked whenever the remote participant's audio settings change.

You can also use the `room.localParticipant.startVideo()` and `room.localParticipant.stopVideo()` methods to turn video off or on. `onRemoteVideoSettingsChanged()` method is invoked whenever the remote participant's video settings change.

If you want to switch to using the device's front and back cameras, call `room.localParticipant.switchCamera()`.

```ts
// mute my microphone
room.localParticipant.muteMicrophone();

// unmute my microphone
room.localParticipant.unmuteMicrophone();

// starts to show video
room.localParticipant.startVideo();

// stops showing video
room.localParticipant.stopVideo();

// changes current video device
room.localParticipant.switchCamera();

// receives the event
room.addListener({
  onRemoteVideoSettingsChanged: (participant: Participant) => {
    if (participant.isVideoEnabled) {
      // remote Participant has started video.
    } else {
      // remote Participant has stopped video.
    }
  },

  onRemoteAudioSettingsChanged: (participant: Participant) => {
    if (participant.isAudioEnabled) {
      // remote Participant has been unmuted.
      // Consider displaying an unmuted icon.
    } else {
      // remote Participant has been muted.
      // Consider displaying and toggling a muted icon.
    }
  },

  ...
});
```

### Exit a room

Participants can use the `exit()` method to leave the room and end the group call. When the remote participant leaves the room, the `onRemoteParticipantExited()` listener method is called.

```ts
// Exit a room
room.exit();

// receives the event
room.addListener({
  onRemoteParticipantExited: (participant: Participant) => {
    // Consider destroying the remote participant's view.
  },

  ...
});
```

## Display Video

By passing the `participant` instance and `ROOM_ID` to the `GroupCallVideoView` component, you can display the streamed view on the screen. Group calls can have up to 6 people, so you should need to think about how to arrange views on the screen depending on the number of participants.

```tsx
import { GroupCallVideoView, SendbirdCalls } from '@sendbird/calls-react-native';

const YourApp = () => {
  const room = await SendbirdCalls.getCachedRoomById(ROOM_ID);

  return (
    <View>
      {room.participants.map((participant) => (
        <GroupCallVideoView
          participant={participant}
          roomId={room.roomId}
          resizeMode={'contain'}
          style={{}}
        />
      )}
    </View>
  );
};
```

<br/>

| Props       | Description                                           |
| ----------- | ----------------------------------------------------- |
| participant | participant instance to display on screen             |
| roomId      | ID of the participating room                          |
| resizeMode  | how to resize the image. 'contain', 'cover', 'center' |
| style       | style object for component                            |

### Retrieve a participant information

The local or remote participant’s information is available via the `room.participants` or `room.localParticipant` and `room.remoteParticipants` properties.
