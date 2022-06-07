import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Keyboard, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

import { DirectCallProperties, SendbirdCalls } from '@sendbird/calls-react-native';

import SBText from '../../../shared/components/SBText';
import SBTextInput from '../../../shared/components/SBTextInput';
import { useStates } from '../../../shared/hooks/useStates';
import { DirectRoutes } from '../../navigations/routes';

const DirectCallScreen = () => {
  const navigation = useNavigation<any>();

  const [state, setState] = useStates({ userId: '' });

  React.useEffect(() => {
    messaging().onMessage((message) => {
      SendbirdCalls.android_handleFirebaseMessageData(message.data);
      // const isSendbirdMessage = SendbirdCalls.android_handleFirebaseMessageData(message.data);
      // if (!isSendbirdMessage) handle your remote notification here
    });

    SendbirdCalls.onRinging(onNavigate);
  }, []);

  const onNavigate = (callProps: DirectCallProperties) => {
    if (callProps.isVideoCall) {
      navigation.navigate(DirectRoutes.VIDEO_CALLING, { callProps });
    } else {
      navigation.navigate(DirectRoutes.VOICE_CALLING, { callProps });
    }
  };

  const calling = async (isVideoCall: boolean) => {
    const callProps = await SendbirdCalls.dial(state.userId, isVideoCall);
    onNavigate(callProps);
  };

  return (
    <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
      <SBText title1 style={{ marginBottom: 32 }}>
        {'Make a call'}
      </SBText>
      <View style={{ width: '100%', marginBottom: 40 }}>
        <SBTextInput
          value={state.userId}
          onChangeText={(userId) => setState({ userId })}
          placeholder={'Enter user ID'}
          style={{ height: 56, borderRadius: 4 }}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => {
            calling(true);
          }}
        >
          <Image source={require('../../../assets/btnCallVideo.png')} style={[styles.btn, { marginRight: 32 }]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => calling(false)}>
          <Image source={require('../../../assets/btnCallVoice.png')} style={styles.btn} />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: 64,
    height: 64,
  },
});

export default DirectCallScreen;
