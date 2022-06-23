import { useState } from 'react';

import { AudioDevice, ParticipantProperties, Room, SendbirdCalls } from '@sendbird/calls-react-native';

import { useEffectAsync } from '../../shared/hooks/useEffectAsync';
import { AppLogger } from '../../shared/utils/logger';

export const useGroupCallRoom = (roomId: string) => {
  const [, update] = useState(0);
  const forceUpdate = () => update((prev) => prev + 1);

  const [room, setRoom] = useState<Room | null>(null);
  const [isFetched, setIsFetched] = useState(false);

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
            console.log('onDeleted : ', room?.roomId);
          },
          onError(e: Error, participant?: ParticipantProperties) {
            console.log('onError : ', e, participant);
          },

          /* Remote Participant */
          onRemoteParticipantEntered(participant: ParticipantProperties) {
            console.log('onRemoteParticipantEntered : ', participant);
            forceUpdate();
          },
          onRemoteParticipantExited(participant: ParticipantProperties) {
            console.log('onRemoteParticipantExited : ', participant);
            forceUpdate();
          },
          onRemoteParticipantStreamStarted(participant: ParticipantProperties) {
            console.log('onRemoteParticipantStreamStarted : ', participant);
            forceUpdate();
          },
          onRemoteVideoSettingsChanged(participant: ParticipantProperties) {
            console.log('onRemoteVideoSettingsChanged : ', participant);
            forceUpdate();
          },
          onRemoteAudioSettingsChanged(participant: ParticipantProperties) {
            console.log('onRemoteAudioSettingsChanged : ', participant);
            forceUpdate();
          },

          onAudioDeviceChanged(currentAudioDevice: AudioDevice | null, availableAudioDevices: AudioDevice[]) {
            console.log('onAudioDeviceChanged : ', currentAudioDevice, availableAudioDevices);
            forceUpdate();
          },

          onCustomItemsUpdated(updatedKeys: string[]) {
            console.log('updatedKeys : ', updatedKeys);
            forceUpdate();
          },
          onCustomItemsDeleted(deletedKeys: string[]) {
            console.log('deletedKeys : ', deletedKeys);
            forceUpdate();
          },
        })
      : // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {};

    return unsubscribe;
  }, []);

  return { room, isFetched, toggleLocalParticipantAudio, toggleLocalParticipantVideo, flipCameraFrontAndBack };
};
