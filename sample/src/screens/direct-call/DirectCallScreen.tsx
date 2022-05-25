import messaging from '@react-native-firebase/messaging';
import React, { useRef, useState } from 'react';
import { Button, ScrollView, Text } from 'react-native';

import { DirectCall, SendbirdCalls, SendbirdCallsVideoView } from '@sendbird/calls-react-native';

import { useAuthContext } from '../../contexts/AuthContext';
import { AppLogger } from '../../libs/factory';


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

  return (
    <ScrollView>
      <Text>{JSON.stringify(currentUser, null, 2)}</Text>

      {call && callState === 'ringing' && <Button title={'Accept'} onPress={() => call.accept()} />}
      {call && callState === 'ringing' && <Button title={'Decline'} onPress={() => call.end()} />}
      {call && callState === 'connected' && <Button title={'Disconnect'} onPress={() => call.end()} />}
      {call && callState === 'connected' && <Button title={'StartVideo'} onPress={() => call.startVideo()} />}
      {call && callState === 'connected' && (
        <>
          <SendbirdCallsVideoView viewType={'remote'} callId={call.callId} style={{ width: '100%', height: 250 }} />
          <SendbirdCallsVideoView viewType={'local'} callId={call.callId} style={{ width: 250, height: 250 }} />
        </>
      )}
    </ScrollView>
  );
};

export default DirectCallScreen;
