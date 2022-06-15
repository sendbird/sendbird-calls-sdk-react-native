import type { AsNativeInterface, DirectCallProperties } from '@sendbird/calls-react-native';

// NTJ - Native To Javascript
// JTN - Javascript To Native

export function convertDirectCallPropsNTJ(data: AsNativeInterface<DirectCallProperties>): DirectCallProperties {
  return {
    ...data,
    ios_callUUID: data.callUUID,
    android_availableAudioDevices: data.availableAudioDevices,
    android_currentAudioDevice: data.currentAudioDevice,
  };
}
