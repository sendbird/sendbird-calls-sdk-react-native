/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createRef } from 'react';
import { NativeMethods, View, ViewProps, findNodeHandle, requireNativeComponent } from 'react-native';

import { LINKING_ERROR } from '../utils/constants';

const MODULE_NAME = 'RNSBDirectCallVideoView';
const NativeViewModule = requireNativeComponent(MODULE_NAME);
if (!NativeViewModule) throw new Error(LINKING_ERROR);

type Props = ViewProps & { viewType: 'local' | 'remote'; callId?: string };
type Ref = React.Component<Props> & Readonly<NativeMethods>;
export default class DirectCallVideoView extends React.PureComponent<Props> {
  private ref = createRef<Ref>();
  private get handle() {
    const nodeHandle = findNodeHandle(this.ref.current as any);
    if (nodeHandle == null || nodeHandle === -1) {
      throw new Error('Cannot found VideoView');
    }
    return nodeHandle;
  }
  private get validProps() {
    if (this.props.viewType !== 'local' && this.props.viewType !== 'remote') {
      throw new Error(`${this.constructor.name}: Invalid ViewType props`);
    }
    return this.props;
  }

  public get videoViewId() {
    return this.handle;
  }

  render() {
    const nativeProps = {
      ...this.validProps,
      style: { width: '100%', height: '100%' },
    };
    return (
      <View style={this.props.style}>
        <NativeViewModule ref={this.ref as any} {...nativeProps} />
      </View>
    );
  }
}
