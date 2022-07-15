import React, { useState } from 'react';

import { Room, SendbirdCalls } from '@sendbird/calls-react-native';

import SettingsView from '../../shared/components/SettingsView';
import { useAuthContext } from '../../shared/contexts/AuthContext';
import { useLayoutEffectAsync } from '../../shared/hooks/useEffectAsync';
import AuthManager from '../../shared/libs/AuthManager';
import { AppLogger } from '../../shared/utils/logger';
import { useGroupNavigation } from '../hooks/useGroupNavigation';
import { GroupRoutes } from '../navigations/routes';

const GroupCallSettingsScreen = () => {
  const {
    navigation: { navigate },
    route: { params },
  } = useGroupNavigation<GroupRoutes.SETTINGS>();
  const { currentUser, setCurrentUser } = useAuthContext();

  const [room, setRoom] = useState<Room | null>(null);
  useLayoutEffectAsync(async () => {
    if (params?.roomId) {
      try {
        setRoom(await SendbirdCalls.getCachedRoomById(params?.roomId));
      } catch (e) {
        AppLogger.log('[GroupCallSettingsScreen::ERROR] getCachedRoomById - ', e);
      }
    }
  }, []);

  if (!currentUser) return null;

  return (
    <SettingsView
      userId={currentUser.userId}
      nickname={currentUser.nickname}
      profileUrl={currentUser.profileUrl}
      onPressApplicationInformation={() => navigate(GroupRoutes.APP_INFO)}
      onPressSignOut={async () => {
        room?.exit();
        await SendbirdCalls.deauthenticate().then(() => {
          setCurrentUser(undefined);
          AuthManager.deAuthenticate();
        });
      }}
    />
  );
};

export default GroupCallSettingsScreen;
