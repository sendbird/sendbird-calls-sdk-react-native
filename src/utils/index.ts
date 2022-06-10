export const noop = () => {
  void 0;
};
export const noopDirectCallListener = {
  onUpdatePropertyManually: noop,
  onAudioDeviceChanged: noop,
  onConnected: noop,
  onCustomItemsDeleted: noop,
  onCustomItemsUpdated: noop,
  onEnded: noop,
  onEstablished: noop,
  onLocalVideoSettingsChanged: noop,
  onReconnected: noop,
  onReconnecting: noop,
  onRemoteAudioSettingsChanged: noop,
  onRemoteRecordingStatusChanged: noop,
  onRemoteVideoSettingsChanged: noop,
  onUserHoldStatusChanged: noop,
};
export const noopRoomListener = {
  onDeleted: noop,
  onError: noop,
  onRemoteParticipantEntered: noop,
  onRemoteParticipantExited: noop,
  onRemoteParticipantStreamStarted: noop,
  onAudioDeviceChanged: noop,
  onRemoteVideoSettingsChanged: noop,
  onRemoteAudioSettingsChanged: noop,
  onCustomItemsUpdated: noop,
  onCustomItemsDeleted: noop,
};
