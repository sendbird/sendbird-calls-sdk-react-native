import messaging from '@react-native-firebase/messaging';
import React, { useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { DirectCall, DirectCallVideoView, SendbirdCalls } from '@sendbird/calls-react-native';

import { useAuthContext } from '../../shared/contexts/AuthContext';
import { AppLogger } from '../../shared/utils/logger';

const DirectCallScreen = () => {
  const { currentUser } = useAuthContext();

  const [callState, setCallState] = useState<string>();
  const [call, setCall] = useState<DirectCall>();
  const subscriber = useRef<() => void>();

  React.useEffect(() => {
    messaging().onMessage((message) => {
      SendbirdCalls.android_handleFirebaseMessageData(message.data);
      // const isSendbirdMessage = SendbirdCalls.android_handleFirebaseMessageData(message.data);
      // if (!isSendbirdMessage) handle your remote notification here
    });

    SendbirdCalls.onRinging(async (call) => {
      const directCall = SendbirdCalls.getDirectCall(call);

      AppLogger.log('onRinging', call.callId);
      setCallState('ringing');
      setCall(directCall);

      subscriber.current = directCall.setListener({
        onConnected: () => {
          AppLogger.log('onConnected:', directCall.callId);
          setCallState('connected');
          setCall(directCall);
        },
        onEnded: () => {
          AppLogger.log('onEnded:', directCall.callId);
          setCallState(undefined);
          setCall(undefined);
        },
      });
    });

    return () => subscriber.current?.();
  }, []);

  const { width, height } = useWindowDimensions();

  return (
    <ScrollView>
      {call && callState === 'connected' && (
        <View style={{ width, height }}>
          <View style={{ flex: 1 }}>
            <DirectCallVideoView viewType={'remote'} callId={call.callId} style={StyleSheet.absoluteFill} />
            <DirectCallVideoView
              viewType={'local'}
              callId={call.callId}
              style={{
                position: 'absolute',
                left: 12,
                top: 12,
                width: width * 0.4,
                height: width * 0.4 * (4 / 3),
                borderWidth: 1,
                borderRadius: 8,
                overflow: 'hidden',
                backgroundColor: 'black',
              }}
            />
          </View>
        </View>
      )}

      <View style={{ width, height }}>
        <Text>{callState}</Text>
        <Text>{JSON.stringify(currentUser, null, 2)}</Text>

        {call && callState === 'ringing' && <Button title={'Accept'} onPress={() => call.accept()} />}
        {call && callState === 'ringing' && <Button title={'Decline'} onPress={() => call.end()} />}
        {call && callState === 'connected' && <Button title={'Disconnect'} onPress={() => call.end()} />}
        {call && callState === 'connected' && <Button title={'StartVideo'} onPress={() => call.startVideo()} />}
        {call && callState === 'connected' && <Button title={'StopVideo'} onPress={() => call.stopVideo()} />}
        {call && callState === 'connected' && <Button title={'Mute'} onPress={() => call?.muteMicrophone()} />}
        {call && callState === 'connected' && <Button title={'Unmute'} onPress={() => call?.unmuteMicrophone()} />}
        {call && callState === 'connected' && <Button title={'Switch'} onPress={() => call?.switchCamera()} />}
      </View>
    </ScrollView>
  );
};

export default DirectCallScreen;
