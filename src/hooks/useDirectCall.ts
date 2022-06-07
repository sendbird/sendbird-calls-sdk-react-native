import { useEffect, useState } from 'react';

import type { DirectCallProperties } from '@sendbird/calls-react-native';
import { DirectCall, SendbirdCalls } from '@sendbird/calls-react-native';

export const useDirectCall = (props: DirectCallProperties) => {
  const [_, update] = useState(0);
  const forceUpdate = () => update((prev) => prev + 1);

  const [call, setCall] = useState<DirectCall>();
  const [status, setStatus] = useState<'ringing' | 'established' | 'connected' | 'reconnecting' | 'ended'>('ringing');

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
      onAudioDeviceChanged() {
        forceUpdate();
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
    });
    setCall(directCall);
  }, []);

  return { call, status };
};
