import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { Button, View, useWindowDimensions } from 'react-native';

import { useDirectCall } from '../../../../src/hooks/useDirectCall';
import type { DirectRoutes, ParamListBase } from '../navigations/routes';

const DirectCallVoiceCallingScreen = () => {
  const { params } = useRoute<RouteProp<ParamListBase, typeof DirectRoutes.VOICE_CALLING>>();
  const call = useDirectCall(params.callProps);
  const { width, height } = useWindowDimensions();

  if (!call) return null;

  return (
    <View>
      <View style={{ width, height: height * 0.5, alignItems: 'flex-end' }}>
        {!call.isOngoing && <Button title={'Accept'} onPress={() => call.accept()} />}
        {!call.isOngoing && <Button title={'Decline'} onPress={() => call.end()} />}
        {call.isOngoing && <Button title={'Disconnect'} onPress={() => call.end()} />}
        {call.isOngoing && <Button title={'Mute'} onPress={() => call?.muteMicrophone()} />}
        {call.isOngoing && <Button title={'Unmute'} onPress={() => call?.unmuteMicrophone()} />}
        {call.isOngoing && <Button title={'Switch'} onPress={() => call?.switchCamera()} />}
      </View>
    </View>
  );
};

export default DirectCallVoiceCallingScreen;
