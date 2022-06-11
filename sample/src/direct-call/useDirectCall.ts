import { useEffect, useState } from 'react';

import type { AudioDeviceRoute, DirectCallProperties } from '@sendbird/calls-react-native';
import { DirectCall, SendbirdCalls } from '@sendbird/calls-react-native';

export type DirectCallStatus = 'pending' | 'established' | 'connected' | 'reconnecting' | 'ended';
export const useDirectCall = (props: DirectCallProperties) => {
  const [, update] = useState(0);
  const forceUpdate = () => update((prev) => prev + 1);

  const [call, setCall] = useState<DirectCall>();
  const [status, setStatus] = useState<DirectCallStatus>('pending');

  const [currentAudioDeviceIOS, setCurrentAudioDeviceIOS] = useState<AudioDeviceRoute>({ inputs: [], outputs: [] });

  useEffect(() => {
    const directCall = SendbirdCalls.getDirectCall(props);

    directCall.setListener({
      onEstablished() {
        setStatus('established');
      },
      onConnected() {
        setStatus('connected');
      },
      onReconnecting() {
        setStatus('reconnecting');
      },
      onReconnected() {
        setStatus('connected');
      },
      onEnded() {
        setStatus('ended');
      },
      onAudioDeviceChanged(_, { platform, data }) {
        if (platform === 'ios') {
          setCurrentAudioDeviceIOS(data.currentRoute);
        } else {
          forceUpdate();
        }
      },
      onCustomItemsDeleted() {
        forceUpdate();
      },
      onCustomItemsUpdated() {
        forceUpdate();
      },
      onLocalVideoSettingsChanged() {
        forceUpdate();
      },
      onRemoteVideoSettingsChanged() {
        forceUpdate();
      },
      onRemoteAudioSettingsChanged() {
        forceUpdate();
      },
      onRemoteRecordingStatusChanged() {
        forceUpdate();
      },
      onUserHoldStatusChanged() {
        forceUpdate();
      },
      onPropertyUpdatedManually() {
        forceUpdate();
      },
    });
    setCall(directCall);
  }, []);

  return { call, status, currentAudioDeviceIOS };
};
