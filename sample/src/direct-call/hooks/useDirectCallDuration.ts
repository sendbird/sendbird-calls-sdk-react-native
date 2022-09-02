import { useRef, useState } from 'react';

import { SendbirdCalls } from '@sendbird/calls-react-native';

import { useEffectAsync } from '../../shared/hooks/useEffectAsync';

export const useDirectCallDuration = (callId: string, interval = 1000) => {
  const [duration, setDuration] = useState(0);
  const mountRef = useRef(true);

  useEffectAsync(() => {
    if (!callId) return;

    // TODO: migrate and check to call.duration
    const timer = setInterval(async () => {
      SendbirdCalls.getDirectCall(callId)
        .then(({ duration }) => mountRef.current && setDuration(duration))
        .catch();
    }, interval);

    return () => {
      mountRef.current = false;
      clearInterval(timer);
    };
  }, [callId, interval]);

  return duration;
};
