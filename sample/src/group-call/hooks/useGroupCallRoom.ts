import { useState } from 'react';

import type { AudioDevice, AudioDeviceRoute, ParticipantProperties, Room } from '@sendbird/calls-react-native';
import { SendbirdCalls } from '@sendbird/calls-react-native';

import { useEffectAsync } from '../../shared/hooks/useEffectAsync';
import { AppLogger } from '../../shared/utils/logger';

export const useGroupCallRoom = (roomId: string) => {
  const [, update] = useState(0);
  const forceUpdate = () => update((prev) => prev + 1);

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
            // TODO: delete AppLogger and add code
            AppLogger.log('useGroupCallRoom :: onDeleted : ', room?.roomId);
          },
          onError(e: Error, participant?: ParticipantProperties) {
            // TODO: delete AppLogger and add code
            AppLogger.log('useGroupCallRoom :: onError : ', e, participant);
          },

          /* Remote Participant */
          onRemoteParticipantEntered(participant: ParticipantProperties) {
            // TODO: delete AppLogger and add code
            AppLogger.log('useGroupCallRoom :: onRemoteParticipantEntered : ', participant);
            forceUpdate();
          },
          onRemoteParticipantExited(participant: ParticipantProperties) {
            // TODO: delete AppLogger and add code
            AppLogger.log('useGroupCallRoom :: onRemoteParticipantExited : ', participant);
            forceUpdate();
          },
          onRemoteParticipantStreamStarted(participant: ParticipantProperties) {
            // TODO: delete AppLogger and add code
            AppLogger.log('useGroupCallRoom :: onRemoteParticipantStreamStarted : ', participant);
            forceUpdate();
          },
          onRemoteVideoSettingsChanged(participant: ParticipantProperties) {
            // TODO: delete AppLogger and add code
            AppLogger.log('useGroupCallRoom :: onRemoteVideoSettingsChanged : ', participant);
            forceUpdate();
          },
          onRemoteAudioSettingsChanged(participant: ParticipantProperties) {
            // TODO: delete AppLogger and add code
            AppLogger.log('useGroupCallRoom :: onRemoteAudioSettingsChanged : ', participant);
            forceUpdate();
          },

          onAudioDeviceChanged(currentAudioDevice: AudioDevice | null, availableAudioDevices: AudioDevice[]) {
            // TODO: setCurrentAudioDeviceIOS
            const todoFlag = false;
            if (todoFlag) {
              const route = { inputs: [], outputs: [] };
              setCurrentAudioDeviceIOS(route);
            }

            // TODO: delete AppLogger and add code
            AppLogger.log('useGroupCallRoom :: onAudioDeviceChanged : ', currentAudioDevice, availableAudioDevices);
            forceUpdate();
          },

          onCustomItemsUpdated(updatedKeys: string[]) {
            // TODO: delete AppLogger and add code
            AppLogger.log('useGroupCallRoom :: updatedKeys : ', updatedKeys);
            forceUpdate();
          },
          onCustomItemsDeleted(deletedKeys: string[]) {
            // TODO: delete AppLogger and add code
            AppLogger.log('useGroupCallRoom :: deletedKeys : ', deletedKeys);
            forceUpdate();
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
