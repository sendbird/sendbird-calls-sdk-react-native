import React, { FC, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import {
  GroupCallVideoView,
  LocalParticipant,
  Participant,
  ParticipantState,
  Room,
} from '@sendbird/calls-react-native';

import IconAssets from '../../assets';
import SBIcon from '../../shared/components/SBIcon';
import SBText from '../../shared/components/SBText';
import Palette from '../../shared/styles/palette';

type LayoutSize = {
  width: number;
  height: number;
};

type GroupCallVideoStreamViewProps = {
  room: Room;
  layoutSize: LayoutSize;
};

type RowCol = {
  row: number;
  column: number;
};

const MARGIN_SIZE = 2;

const GroupCallVideoStreamView: FC<GroupCallVideoStreamViewProps> = ({ room, layoutSize }) => {
  const [rowCol, setRowCol] = useState<RowCol>({ row: 1, column: 1 });
  const [viewSize, setViewSize] = useState<LayoutSize>({ width: 0, height: 0 });

  useEffect(() => {
    setRowCol(() => {
      if (room.participants.length > 4) return { row: 3, column: 2 };
      if (room.participants.length > 2) return { row: 2, column: 2 };
      if (room.participants.length == 2) return { row: 1, column: 2 };
      else return { row: 1, column: 1 };
    });
  }, [room.participants]);

  useEffect(() => {
    const { width, height } = layoutSize;
    const { row, column } = rowCol;
    if (width !== 0 && height !== 0) {
      if (row > 1) {
        // 3명 이상
        const layoutHeight = height / row - MARGIN_SIZE * 2;
        const layoutWidth = layoutHeight * (width / height) - MARGIN_SIZE * 2;

        setViewSize({ width: layoutWidth, height: layoutHeight });
      } else {
        // 2명 이하
        const layoutWidth = width / column - MARGIN_SIZE * 2;
        const layoutHeight = layoutWidth * (height / width);

        setViewSize({ width: layoutWidth, height: layoutHeight });
      }
    }
  }, [layoutSize.width, layoutSize.height, rowCol.row, rowCol.column]);

  return (
    <View
      style={[
        styles.container,
        {
          maxWidth: viewSize.width * rowCol.column + MARGIN_SIZE * 4,
          flexWrap: rowCol.row === 1 ? 'nowrap' : 'wrap',
        },
      ]}
    >
      {room.participants.map((participant) => (
        <View key={participant.participantId} style={viewSize}>
          <GroupCallVideoView participant={participant} roomId={room.roomId} style={styles.videoView} />

          {/* User Video Off */}
          {(!getIsEnabled(participant, room.localParticipant, 'video') ||
            (!isLocalParticipant(participant, room.localParticipant) &&
              participant.state !== ParticipantState.CONNECTED)) && (
            <View style={[styles.videoView, StyleSheet.absoluteFillObject]}>
              <Image
                source={participant.user.profileUrl ? { uri: participant.user.profileUrl } : IconAssets.Avatar}
                style={styles.profileImage}
              />
            </View>
          )}

          {/* UserID and User Audio Off */}
          <View style={styles.userId}>
            {!getIsEnabled(participant, room.localParticipant, 'audio') && (
              <SBIcon icon="AudioOff" size={11} color={Palette.support01} style={{ marginRight: 4 }} />
            )}
            <SBText
              caption4
              numberOfLines={1}
              ellipsizeMode={'tail'}
              color={Palette.onBackgroundDark01}
              style={{ maxWidth: viewSize.width * 0.7 }}
            >
              User ID: {participant.user.userId}
            </SBText>
          </View>
        </View>
      ))}
    </View>
  );
};

const isLocalParticipant = (participant: Participant, localParticipant: LocalParticipant | null) => {
  return participant.participantId === localParticipant?.participantId;
};

const getIsEnabled = (participant: Participant, localParticipant: LocalParticipant | null, type: 'video' | 'audio') => {
  const isLocal = isLocalParticipant(participant, localParticipant);
  if (type === 'video') {
    return isLocal ? localParticipant?.isVideoEnabled : participant.isVideoEnabled;
  } else {
    // audio
    return isLocal ? localParticipant?.isAudioEnabled : participant.isAudioEnabled;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: Palette.background600,
  },
  videoView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: MARGIN_SIZE,
    backgroundColor: Palette.background500,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Palette.background300,
  },
  userId: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 20,
    backgroundColor: Palette.overlay01,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

export default GroupCallVideoStreamView;
