export enum GroupRoutes {
  SIGN_IN = 'sign_in',
  HOME_TAB = 'home_tab',
  DIAL = 'dial',
  SETTING_STACK = 'setting_stack',
  SETTINGS = 'settings',
  APP_INFO = 'app_info',
  ROOM = 'room',
  ENTER_ROOM = 'enter_room',
  PARTICIPANTS = 'participants',
  ROOM_INFO = 'room_info',
}

export type GroupRouteWithParams =
  | {
      route: GroupRoutes.SIGN_IN;
      params: undefined;
    }
  | {
      route: GroupRoutes.HOME_TAB;
      params: undefined;
    }
  | {
      route: GroupRoutes.DIAL;
      params: undefined;
    }
  | {
      route: GroupRoutes.SETTING_STACK;
      params: undefined;
    }
  | {
      route: GroupRoutes.SETTINGS;
      params: undefined;
    }
  | {
      route: GroupRoutes.APP_INFO;
      params: undefined;
    }
  | {
      route: GroupRoutes.ROOM;
      params: { roomId: string };
    }
  | {
      route: GroupRoutes.ENTER_ROOM;
      params: { roomId: string };
    }
  | {
      route: GroupRoutes.PARTICIPANTS;
      params: undefined;
    }
  | {
      route: GroupRoutes.ROOM_INFO;
      params: {
        roomId: string;
        createdBy: string;
      };
    };
