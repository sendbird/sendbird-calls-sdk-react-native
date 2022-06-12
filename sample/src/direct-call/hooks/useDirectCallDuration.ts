import { useState } from 'react';

import { SendbirdCalls } from '@sendbird/calls-react-native';

import { useEffectAsync } from '../../shared/hooks/useEffectAsync';

export const useDirectCallDuration = (callId: string, interval = 1000) => {
  const [duration, setDuration] = useState(0);
  useEffectAsync(() => {
    if (!callId) return;

    const timer = setInterval(async () => {
      SendbirdCalls.getDirectCall(callId)
        .then(({ duration }) => setDuration(duration))
        .catch();
    }, interval);

    return () => clearInterval(timer);
  }, [callId, interval]);

  return duration;
};
