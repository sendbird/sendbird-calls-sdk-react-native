import messaging from '@react-native-firebase/messaging';
import React from 'react';
import { Alert, Keyboard, Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

import { DirectCallProperties, SendbirdCalls } from '@sendbird/calls-react-native';

import SBIcon from '../../../shared/components/SBIcon';
import SBText from '../../../shared/components/SBText';
import SBTextInput from '../../../shared/components/SBTextInput';
import { useStates } from '../../../shared/hooks/useStates';
import { AppLogger } from '../../../shared/utils/logger';
import { DirectRoutes } from '../../navigations/routes';
import { useDirectNavigation } from '../../navigations/useDirectNavigation';

const DirectCallScreen = () => {
  const { navigation } = useDirectNavigation<DirectRoutes.DIAL>();

  const [state, setState] = useStates({
    userId: Platform.select({
      ios: 'DirectCall_android',
      android: 'DirectCall_ios',
      default: 'test',
    }),
  });

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
    try {
      const callProps = await SendbirdCalls.dial(state.userId, isVideoCall);
      AppLogger.log('dial called', callProps.callId);
      onNavigate(callProps);
    } catch (e) {
      // @ts-ignore
      Alert.alert('Failed', e.message);
    }
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
        <TouchableOpacity disabled={!state.userId} onPress={() => calling(true)}>
          <SBIcon icon={'btnCallVideo'} size={64} containerStyle={{ marginRight: 32 }} />
        </TouchableOpacity>
        <TouchableOpacity disabled={!state.userId} onPress={() => calling(false)}>
          <SBIcon icon={'btnCallVoice'} size={64} />
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
});

export default DirectCallScreen;
