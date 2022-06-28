/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createRef } from 'react';
import { View, ViewProps, findNodeHandle, requireNativeComponent } from 'react-native';

import { LINKING_ERROR } from '../utils/constants';
import { Participant } from './Participant';

const MODULE_NAME = 'RNSBGroupCallVideoView';
const NativeViewModule = requireNativeComponent(MODULE_NAME);
if (!NativeViewModule) throw new Error(LINKING_ERROR);

export interface GroupCallVideoViewProps extends ViewProps {
  participant?: Participant;
  roomId?: string;
}
export default class GroupCallVideoView extends React.PureComponent<GroupCallVideoViewProps> {
  private ref = createRef<any>();

  private get handle() {
    const nodeHandle = findNodeHandle(this.ref.current as any);
    if (nodeHandle == null || nodeHandle === -1) {
      throw new Error('Cannot found VideoView');
    }
    return nodeHandle;
  }
  private get validProps() {
    return {
      participantId: this.props.participant?.participantId,
      roomId: this.props.roomId,
      state: this.props.participant?.state,
      style: { width: '100%', height: '100%' },
    };
  }

  public get videoViewId() {
    return this.handle;
  }

  render() {
    return (
      <View style={this.props.style}>
        <NativeViewModule ref={this.ref as any} {...this.validProps} />
      </View>
    );
  }
}
