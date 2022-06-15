import { GroupRoutes } from './routes';

export type GroupCallSettingStackParamList = {
  [GroupRoutes.SETTINGS]: undefined;
  [GroupRoutes.APP_INFO]: undefined;
};

export type GroupCallRootStackParamList = {
  [GroupRoutes.SIGN_IN]: undefined;
  [GroupRoutes.HOME_TAB]: undefined;
  [GroupRoutes.ROOM_INFO]: { roomId: string; createdBy: string };
};
