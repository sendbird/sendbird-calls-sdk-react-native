/* eslint-disable @typescript-eslint/no-empty-function */
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

import type { AudioDeviceRoute, Participant, Room } from '@sendbird/calls-react-native';
import { SendbirdCalls } from '@sendbird/calls-react-native';

import { useEffectAsync } from '../../shared/hooks/useEffectAsync';
import { AppLogger } from '../../shared/utils/logger';

export const useGroupCallRoom = (roomId: string) => {
  const [, update] = useState(0);
  const forceUpdate = () => update((prev) => prev + 1);

  const { canGoBack, goBack } = useNavigation();

  const [room, setRoom] = useState<Room | null>(null);
  const [isFetched, setIsFetched] = useState(false);
  const [currentAudioDeviceIOS, setCurrentAudioDeviceIOS] = useState<AudioDeviceRoute>({ inputs: [], outputs: [] });

  const toggleLocalParticipantAudio = () => {
    room?.localParticipant?.isAudioEnabled
      ? room.localParticipant.muteMicrophone()
      : room?.localParticipant?.unmuteMicrophone();
  };
  const toggleLocalParticipantVideo = () => {
    room?.localParticipant?.isVideoEnabled ? room.localParticipant.stopVideo() : room?.localParticipant?.startVideo();
  };
  const flipCameraFrontAndBack = async () => {
    try {
      await room?.localParticipant?.switchCamera();
    } catch (e) {
      AppLogger.log('[ERROR] RoomScreen switchCamera', e);
    }
  };

  useEffectAsync(async () => {
    const room = await SendbirdCalls.getCachedRoomById(roomId);
    setRoom(room);
    setIsFetched(true);

    const unsubscribe = room
      ? room?.addListener({
          onPropertyUpdatedManually() {
            forceUpdate();
          },

          onDeleted() {
            canGoBack() && goBack();
          },
          onError(e: Error, participant: Participant | null) {
            // do something...
            AppLogger.log('[useGroupCallRoom] onError(e, participant) : ', e, participant);
          },

          /* Remote Participant */
          onRemoteParticipantEntered(participant: Participant) {
            forceUpdate();
            // do something...
            AppLogger.log('[useGroupCallRoom] onRemoteParticipantEntered(participant) : ', participant);
          },
          onRemoteParticipantExited(participant: Participant) {
            forceUpdate();
            // do something...
            AppLogger.log('[useGroupCallRoom] onRemoteParticipantExited(participant) : ', participant);
          },
          onRemoteParticipantStreamStarted(participant: Participant) {
            forceUpdate();
            // do something...
            AppLogger.log('[useGroupCallRoom] onRemoteParticipantStreamStarted(participant) : ', participant);
          },
          onRemoteVideoSettingsChanged(participant: Participant) {
            forceUpdate();
            // do something...
            AppLogger.log('[useGroupCallRoom] onRemoteVideoSettingsChanged(participant) : ', participant);
          },
          onRemoteAudioSettingsChanged(participant: Participant) {
            forceUpdate();
            // do something...
            AppLogger.log('[useGroupCallRoom] onRemoteAudioSettingsChanged(participant) : ', participant);
          },

          onAudioDeviceChanged({ platform, data }) {
            AppLogger.log('[useGroupCallRoom] onAudioDeviceChanged(platform, data) : ', platform, data);

            if (platform === 'ios') {
              setCurrentAudioDeviceIOS(data.currentRoute);
            } else {
              forceUpdate();
            }
          },

          onCustomItemsUpdated(updatedKeys: string[]) {
            forceUpdate();
            // do something...
            AppLogger.log('[useGroupCallRoom] onCustomItemsUpdated(updatedKeys) : ', updatedKeys);
          },
          onCustomItemsDeleted(deletedKeys: string[]) {
            forceUpdate();
            // do something...
            AppLogger.log('[useGroupCallRoom] onCustomItemsDeleted(deletedKeys) : ', deletedKeys);
          },
        })
      : // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {};

    return unsubscribe;
  }, []);

  return {
    room,
    isFetched,
    currentAudioDeviceIOS,
    toggleLocalParticipantAudio,
    toggleLocalParticipantVideo,
    flipCameraFrontAndBack,
  };
};
