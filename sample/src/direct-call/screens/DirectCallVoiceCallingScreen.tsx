import React, { useEffect } from 'react';
import { View } from 'react-native';

import Palette from '../../shared/styles/palette';
import DirectCallControllerView from '../components/DirectCallControllerView';
import { useDirectCall } from '../hooks/useDirectCall';
import type { DirectRoutes } from '../navigations/routes';
import { useDirectNavigation } from '../navigations/useDirectNavigation';

const DirectCallVoiceCallingScreen = () => {
  const { route, navigation } = useDirectNavigation<DirectRoutes.VOICE_CALLING>();
  const { call, status, currentAudioDeviceIOS } = useDirectCall(route.params.callId);

  useEffect(() => {
    if (status === 'ended') {
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    }
  }, [status]);

  if (!call) return null;

  return (
    <View style={{ flex: 1, backgroundColor: Palette.background500 }}>
      <DirectCallControllerView status={status} call={call} ios_audioDevice={currentAudioDeviceIOS} />
    </View>
  );
};

export default DirectCallVoiceCallingScreen;
