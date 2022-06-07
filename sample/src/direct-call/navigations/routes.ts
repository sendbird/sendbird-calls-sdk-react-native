import type { DirectCallProperties } from '@sendbird/calls-react-native';

export const DirectRoutes = {
  SIGN_IN: 'sign-in',
  HOME_TAB: 'home-tab',
  DIAL: 'dial',
  HISTORY: 'history',
  SETTINGS_STACK: 'settings-stack',
  SETTINGS: 'settings',
  APP_INFO: 'app-info',
  VIDEO_CALLING: 'video-calling',
  VOICE_CALLING: 'voice-calling',
} as const;

export type ParamListBase = {
  [DirectRoutes.VIDEO_CALLING]: {
    callProps: DirectCallProperties;
  };
  [DirectRoutes.VOICE_CALLING]: {
    callProps: DirectCallProperties;
  };
};
