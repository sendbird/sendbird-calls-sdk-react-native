import React, { createRef } from 'react';
import { NativeMethods, ViewProps, findNodeHandle, requireNativeComponent } from 'react-native';

import SendbirdCalls from '@sendbird/calls-react-native';

const MODULE_NAME = 'RNSendbirdCallsVideoView';
const VideoView = requireNativeComponent(MODULE_NAME);

interface NativeProps extends ViewProps {
  type: 'local' | 'remote';
  callId?: string;
}
type RefType = React.Component<NativeProps> & Readonly<NativeMethods>;

export class CallsNativeVideoView extends React.PureComponent<NativeProps> {
  private _ref = createRef<RefType>();
  private get module() {
    return SendbirdCalls;
  }
  private get handle() {
    const nodeHandle = findNodeHandle(this._ref.current);
    if (nodeHandle == null || nodeHandle === -1) {
      throw new Error('Cannot found VideoView');
    }
    return nodeHandle;
  }

  public get videoViewId() {
    return this.handle;
  }

  public setCallId(callId: string) {
    switch (this.props.type) {
      case 'local': {
        return this.module.nativeModule.updateLocalVideoView(callId, this.handle);
      }
      case 'remote': {
        return this.module.nativeModule.updateRemoteVideoView(callId, this.handle);
      }
    }
  }

  render() {
    return <VideoView ref={this._ref as any} {...this.props} />;
  }
}
