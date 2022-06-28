/* eslint-disable @typescript-eslint/no-empty-function */
import { useState } from 'react';

import type { AudioDevice, AudioDeviceRoute, Participant, Room, RoomListener } from '@sendbird/calls-react-native';
import { SendbirdCalls } from '@sendbird/calls-react-native';

import { useEffectAsync } from '../../shared/hooks/useEffectAsync';
import { AppLogger } from '../../shared/utils/logger';

export const useGroupCallRoom = (roomId: string) => {
  const [, update] = useState(0);
  const forceUpdate = () => update((prev) => prev + 1);

  const [room, setRoom] = useState<Room | null>(null);
  const [isFetched, setIsFetched] = useState(false);
  const [currentAudioDeviceIOS, setCurrentAudioDeviceIOS] = useState<AudioDeviceRoute>({ inputs: [], outputs: [] });
  const [roomListener, setRoomListener] = useState<Partial<RoomListener>>({});

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
            roomListener.onDeleted?.();
          },
          onError(e: Error, participant: Participant | null) {
            roomListener.onError?.(e, participant);
          },

          /* Remote Participant */
          onRemoteParticipantEntered(participant: Participant) {
            forceUpdate();
            roomListener.onRemoteParticipantEntered?.(participant);
          },
          onRemoteParticipantExited(participant: Participant) {
            forceUpdate();
            roomListener.onRemoteParticipantExited?.(participant);
          },
          onRemoteParticipantStreamStarted(participant: Participant) {
            forceUpdate();
            roomListener.onRemoteParticipantStreamStarted?.(participant);
          },
          onRemoteVideoSettingsChanged(participant: Participant) {
            forceUpdate();
            roomListener.onRemoteVideoSettingsChanged?.(participant);
          },
          onRemoteAudioSettingsChanged(participant: Participant) {
            forceUpdate();
            roomListener.onRemoteAudioSettingsChanged?.(participant);
          },

          onAudioDeviceChanged(currentAudioDevice: AudioDevice | null, availableAudioDevices: AudioDevice[]) {
            // TODO: setCurrentAudioDeviceIOS
            const todoFlag = false;
            if (todoFlag) {
              const route = { inputs: [], outputs: [] };
              setCurrentAudioDeviceIOS(route);
            }

            forceUpdate();
            roomListener.onAudioDeviceChanged?.(currentAudioDevice, availableAudioDevices);
          },

          onCustomItemsUpdated(updatedKeys: string[]) {
            forceUpdate();
            roomListener.onCustomItemsUpdated?.(updatedKeys);
          },
          onCustomItemsDeleted(deletedKeys: string[]) {
            forceUpdate();
            roomListener.onCustomItemsDeleted?.(deletedKeys);
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
    setRoomListener,
  };
};
