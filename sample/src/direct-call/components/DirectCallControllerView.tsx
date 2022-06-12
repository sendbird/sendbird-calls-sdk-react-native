import React, { FC, useMemo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AudioDeviceRoute, DirectCall, DirectCallUserRole } from '@sendbird/calls-react-native';

import IconAssets from '../../assets';
import AudioDeviceButton from '../../shared/components/AudioDeviceButton';
import SBIcon from '../../shared/components/SBIcon';
import SBText from '../../shared/components/SBText';
import Palette from '../../shared/styles/palette';
import { DirectCallStatus } from '../hooks/useDirectCall';
import { useDirectCallDuration } from '../hooks/useDirectCallDuration';

type ControllerViewProps = {
  status: DirectCallStatus;
  call: DirectCall;
  ios_audioDevice: AudioDeviceRoute;
};
const DirectCallControllerView: FC<ControllerViewProps> = ({ status, call, ios_audioDevice }) => {
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
      <View style={styles.topController}>
        <View style={{ alignItems: 'flex-end' }}>
          {call.isVideoCall && (
            <Pressable onPress={() => call.switchCamera()}>
              <SBIcon icon={'btnCameraFlipIos'} size={48} />
            </Pressable>
          )}
        </View>
        <View style={styles.information}>
          {status === 'pending' && (
            <>
              <SBText h2 color={Palette.onBackgroundDark01} style={styles.nickname}>
                {remoteUserNickname}
              </SBText>
              <SBText color={Palette.onBackgroundDark01} body3>
                {call.myRole === DirectCallUserRole.CALLER
                  ? 'calling...'
                  : `Incoming ${call.isVideoCall ? 'video' : 'voice'} call...`}
              </SBText>
            </>
          )}
          {status !== 'pending' && !call.isVideoCall && (
            <>
              <Image
                style={styles.profile}
                source={call.remoteUser?.profileUrl ? { uri: call.remoteUser?.profileUrl } : IconAssets.Avatar}
              />
              <SBText h2 color={Palette.onBackgroundDark01} style={styles.nickname}>
                {remoteUserNickname}
              </SBText>
              <StatusView status={status} callId={call.callId} />
            </>
          )}
          <View style={styles.remoteMuteStatus}>
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

      <View style={styles.bottomController}>
        {status !== 'ended' && (
          <>
            <View style={[styles.bottomButtonGroup, { marginBottom: 24 }]}>
              <Pressable
                style={styles.bottomButton}
                onPress={() => {
                  if (call.isLocalAudioEnabled) call.muteMicrophone();
                  else call.unmuteMicrophone();
                }}
              >
                <SBIcon icon={call.isLocalAudioEnabled ? 'btnAudioOff' : 'btnAudioOffSelected'} size={64} />
              </Pressable>
              {call.isVideoCall && (
                <Pressable
                  style={styles.bottomButton}
                  onPress={() => {
                    if (call.isLocalVideoEnabled) call.stopVideo();
                    else call.startVideo();
                  }}
                >
                  <SBIcon icon={call.isLocalVideoEnabled ? 'btnVideoOff' : 'btnVideoOffSelected'} size={64} />
                </Pressable>
              )}
              <AudioDeviceButton
                currentAudioDeviceIOS={ios_audioDevice}
                availableAudioDevicesAndroid={call.android_availableAudioDevices}
                currentAudioDeviceAndroid={call.android_currentAudioDevice}
                onSelectAudioDeviceAndroid={call.android_selectAudioDevice}
              />
            </View>

            <View style={styles.bottomButtonGroup}>
              {call.myRole === DirectCallUserRole.CALLEE && status === 'pending' && (
                <Pressable style={styles.bottomButton} onPress={() => call.accept()}>
                  <SBIcon icon={'btnCallVideoAccept'} size={64} />
                </Pressable>
              )}
              <Pressable onPress={() => call.end()}>
                <SBIcon icon={'btnCallEnd'} size={64} />
              </Pressable>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const StatusView = ({ callId, status }: { callId: string; status: DirectCallStatus }) => {
  const seconds = useDirectCallDuration(callId);
  return (
    <SBText color={Palette.onBackgroundDark01} body3>
      {status === 'ended' ? 'Ended' : secondsToHHMMSS(seconds)}
    </SBText>
  );
};

const secondsToHHMMSS = (seconds: number) => {
  return new Date(seconds * 1000).toISOString().substring(11, 19);
};

const styles = StyleSheet.create({
  topController: {
    flex: 1,
  },
  information: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  profile: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 32,
  },
  nickname: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  remoteMuteStatus: {
    height: 150,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bottomController: {
    flex: 0.8,
    justifyContent: 'flex-end',
    paddingBottom: 64,
  },
  bottomButton: {
    marginRight: 24,
  },
  bottomButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default DirectCallControllerView;
