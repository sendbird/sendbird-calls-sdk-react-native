import type { AsNativeInterface, DirectCallProperties } from '@sendbird/calls-react-native';

// NTJ - Native To Javascript
// JTN - Javascript To Native

export function convertDirectCallPropsNTJ(data: AsNativeInterface<DirectCallProperties>): DirectCallProperties {
  return {
    ...data,
    callLog: data.callLog && {
      ...data.callLog,
      android_endedUserId: data.callLog.endedUserId,
      android_users: data.callLog.users,
    },
    android_availableAudioDevices: data.availableAudioDevices,
    android_currentAudioDevice: data.currentAudioDevice,
  };
}
