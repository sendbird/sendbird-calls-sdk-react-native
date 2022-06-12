import React, { FC, useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, StatusBar, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { AudioDeviceRoute, DirectCall } from '@sendbird/calls-react-native';
import { DirectCallUserRole, DirectCallVideoView } from '@sendbird/calls-react-native';

import AudioDeviceButton from '../../shared/components/AudioDeviceButton';
import SBIcon from '../../shared/components/SBIcon';
import SBText from '../../shared/components/SBText';
import Palette from '../../shared/styles/palette';
import { DirectCallStatus, useDirectCall } from '../hooks/useDirectCall';
import type { DirectRoutes } from '../navigations/routes';
import { useDirectNavigation } from '../navigations/useDirectNavigation';

const DirectCallVideoCallingScreen = () => {
  const { navigation, route } = useDirectNavigation<DirectRoutes.VIDEO_CALLING>();
  const { call, status, currentAudioDeviceIOS } = useDirectCall(route.params.callId);

  useEffect(() => {
    if (status === 'ended') navigation.goBack();
  }, [status]);

  if (!call) return null;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <ContentView status={status} call={call} />
      <ControllerView status={status} call={call} ios_audioDevice={currentAudioDeviceIOS} />
    </View>
  );
};

const useLocalViewSize = (initialScale: 'small' | 'large' = 'large') => {
  const { width, height } = useWindowDimensions();

  const { top: topInset } = useSafeAreaInsets();

  const MAX_WIDTH = Math.min(width, height);
  const MIN_WIDTH = 96;
  const MAX_HEIGHT = Math.max(width, height);
  const MIN_HEIGHT = 160;

  const viewWidth = useRef(new Animated.Value(initialScale === 'large' ? MAX_WIDTH : MIN_WIDTH)).current;
  const left = viewWidth.interpolate({
    inputRange: [MIN_WIDTH, MAX_WIDTH],
    outputRange: [16, 0],
    extrapolate: 'clamp',
  });
  const top = viewWidth.interpolate({
    inputRange: [MIN_WIDTH, MAX_WIDTH],
    outputRange: [16 + topInset, 0],
    extrapolate: 'clamp',
  });
  const viewHeight = viewWidth.interpolate({
    inputRange: [MIN_WIDTH, MAX_WIDTH],
    outputRange: [MIN_HEIGHT, MAX_HEIGHT],
    extrapolate: 'clamp',
  });
  const scaleTo = (size: 'small' | 'large') => {
    Animated.timing(viewWidth, {
      toValue: size === 'small' ? MIN_WIDTH : MAX_WIDTH,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  return {
    left,
    top,
    viewWidth,
    viewHeight,
    scaleTo,
  };
};

type CallStatusProps = {
  status: DirectCallStatus;
  call: DirectCall;
};
const ContentView: FC<CallStatusProps> = ({ call, status }) => {
  const { left, top, viewWidth, viewHeight, scaleTo } = useLocalViewSize('large');

  useEffect(() => {
    switch (status) {
      case 'pending': {
        scaleTo('large');
        break;
      }
      case 'established':
      case 'connected':
      case 'reconnecting': {
        scaleTo('small');
        break;
      }
      case 'ended': {
        break;
      }
    }
  }, [status]);

  return (
    <View style={{ flex: 1 }}>
      <DirectCallVideoView
        viewType={'remote'}
        callId={call.callId}
        style={[StyleSheet.absoluteFillObject, { backgroundColor: 'black' }]}
      />
      <Animated.View style={{ left, top, width: viewWidth, height: viewHeight, backgroundColor: 'black' }}>
        <DirectCallVideoView viewType={'local'} callId={call.callId} android_zOrderMediaOverlay />
      </Animated.View>
    </View>
  );
};

type ControllerViewProps = CallStatusProps & { ios_audioDevice: AudioDeviceRoute };
// TODO: Extract styles
const ControllerView: FC<ControllerViewProps> = ({ status, call, ios_audioDevice }) => {
  const { top } = useSafeAreaInsets();
  const remoteUserNickname = useMemo(() => {
    if (call.myRole === DirectCallUserRole.CALLEE) {
      return call.caller?.nickname ?? 'No name';
    }
    if (call.myRole === DirectCallUserRole.CALLER) {
      return call.callee?.nickname ?? 'No name';
    }
    return 'No name';
  }, [call]);

  return (
    <View style={{ position: 'absolute', left: 16, right: 16, top: 16 + top, bottom: 16 }}>
      <View style={{ flex: 1 }}>
        <View style={{ alignItems: 'flex-end' }}>
          <Pressable onPress={() => call.switchCamera()}>
            <SBIcon icon={'btnCameraFlipIos'} size={48} />
          </Pressable>
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          {status === 'pending' && (
            <SBText h2 color={Palette.onBackgroundDark01} style={{ fontSize: 20, fontWeight: '600' }}>
              {remoteUserNickname}
            </SBText>
          )}
          {status === 'pending' && (
            <SBText color={Palette.onBackgroundDark01} body3>
              {call.myRole === DirectCallUserRole.CALLER ? 'calling...' : 'Incoming voice call...'}
            </SBText>
          )}
          <View style={{ height: 150, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            {status !== 'pending' && !call.isRemoteAudioEnabled && (
              <>
                <SBIcon
                  icon={'AudioOff'}
                  size={40}
                  color={Palette.onBackgroundDark01}
                  containerStyle={{ marginBottom: 16 }}
                />
                <SBText color={Palette.onBackgroundDark01} body3>{`${remoteUserNickname} is muted`}</SBText>
              </>
            )}
          </View>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 64 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 24 }}>
          <Pressable
            onPress={() => {
              if (call.isLocalAudioEnabled) {
                call.muteMicrophone();
              } else {
                call.unmuteMicrophone();
              }
            }}
          >
            <SBIcon icon={call.isLocalAudioEnabled ? 'btnAudioOff' : 'btnAudioOffSelected'} size={64} />
          </Pressable>
          <Pressable
            style={{ marginHorizontal: 24 }}
            onPress={() => {
              if (call.isLocalVideoEnabled) {
                call.stopVideo();
              } else {
                call.startVideo();
              }
            }}
          >
            <SBIcon icon={call.isLocalVideoEnabled ? 'btnVideoOff' : 'btnVideoOffSelected'} size={64} />
          </Pressable>
          <AudioDeviceButton
            currentAudioDeviceIOS={ios_audioDevice}
            availableAudioDevicesAndroid={call.android_availableAudioDevices}
            currentAudioDeviceAndroid={call.android_currentAudioDevice}
            onSelectAudioDeviceAndroid={call.android_selectAudioDevice}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {call.myRole === DirectCallUserRole.CALLEE && status === 'pending' && (
            <Pressable style={{ marginRight: 24 }} onPress={() => call.accept()}>
              <SBIcon icon={'btnCallVideoAccept'} size={64} />
            </Pressable>
          )}
          <Pressable onPress={() => call.end()}>
            <SBIcon icon={'btnCallEnd'} size={64} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default DirectCallVideoCallingScreen;
