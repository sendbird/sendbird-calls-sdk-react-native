/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createRef } from 'react';
import { NativeMethods, ViewProps, findNodeHandle, requireNativeComponent } from 'react-native';

import { LINKING_ERROR } from '../utils/constants';
import type NativeBinder from './NativeBinder';
import type SendbirdCallsModule from './SendbirdCallsModule';

const MODULE_NAME = 'RNSendbirdCallsVideoView';
const NativeViewModule = requireNativeComponent(MODULE_NAME);
if (!NativeViewModule) throw new Error(LINKING_ERROR);

interface NativeProps extends ViewProps {
  viewType: 'local' | 'remote';
  callId?: string;
}

type RefType = React.Component<NativeProps> & Readonly<NativeMethods>;

export const createVideoView = (module: SendbirdCallsModule, binder: NativeBinder) => {
  return class SendbirdCallsVideoView extends React.PureComponent<NativeProps> {
    private ref = createRef<RefType>();
    private binder = binder;
    private module = module;
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

    public setCallId(callId: string) {
      switch (this.props.viewType) {
        case 'local': {
          return this.binder.nativeModule.updateLocalVideoView(callId, this.videoViewId);
        }
        case 'remote': {
          return this.binder.nativeModule.updateRemoteVideoView(callId, this.videoViewId);
        }
      }
    }

    render() {
      if (!this.module.initialized) return null;
      return <NativeViewModule ref={this.ref as any} {...this.validProps} />;
    }
  };
};
