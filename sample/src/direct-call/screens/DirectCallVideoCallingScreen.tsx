import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Button, StyleSheet, View, useWindowDimensions } from 'react-native';

import { DirectCallVideoView } from '@sendbird/calls-react-native';

import { useDirectCall } from '../../../../src/hooks/useDirectCall';
import SBText from '../../shared/components/SBText';
import type { ParamListBase } from '../navigations/routes';
import type { DirectRoutes } from '../navigations/routes';

const DirectCallVideoCallingScreen = () => {
  const navigation = useNavigation<any>();
  const { params } = useRoute<RouteProp<ParamListBase, typeof DirectRoutes.VIDEO_CALLING>>();
  const { call, status } = useDirectCall(params.callProps);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (call?.isEnded) navigation.goBack();
  }, [call?.isEnded]);

  if (!call) return null;

  return (
    <View style={{ flex: 1 }}>
      <SBText>{status}</SBText>
      {status === 'connected' && (
        <View style={{ width, height, zIndex: -99 }}>
          <DirectCallVideoView viewType={'remote'} callId={call.callId} style={StyleSheet.absoluteFill} />
          <DirectCallVideoView
            viewType={'local'}
            callId={call.callId}
            style={{
              position: 'absolute',
              left: 12,
              top: 12,
              width: width * 0.4,
              height: width * 0.4 * (9 / 6),
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: 'black',
            }}
          />
        </View>
      )}

      <View style={{ position: 'absolute', bottom: 0, width, height: height * 0.5, alignItems: 'flex-end' }}>
        {status === 'ringing' && <Button title={'Accept'} onPress={() => call.accept()} />}
        {status === 'ringing' && <Button title={'Decline'} onPress={() => call.end()} />}
        {status.match(/connected|reconnecting/) && <Button title={'Disconnect'} onPress={() => call.end()} />}
        {status === 'connected' && <Button title={'StartVideo'} onPress={() => call.startVideo()} />}
        {status === 'connected' && <Button title={'StopVideo'} onPress={() => call.stopVideo()} />}
        {status === 'connected' && <Button title={'Mute'} onPress={() => call?.muteMicrophone()} />}
        {status === 'connected' && <Button title={'Unmute'} onPress={() => call?.unmuteMicrophone()} />}
        {status === 'connected' && <Button title={'Switch'} onPress={() => call?.switchCamera()} />}
      </View>
    </View>
  );
};

export default DirectCallVideoCallingScreen;
