import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { GroupCallVideoView, Room } from '@sendbird/calls-react-native';

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
        </View>
      ))}
    </View>
  );
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
});

export default GroupCallVideoStreamView;
