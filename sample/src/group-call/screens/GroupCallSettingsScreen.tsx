import React from 'react';

import { SendbirdCalls } from '@sendbird/calls-react-native';

import SettingsView from '../../shared/components/SettingsView';
import { useAuthContext } from '../../shared/contexts/AuthContext';
import AuthManager from '../../shared/libs/AuthManager';
import { useGroupNavigation } from '../hooks/useGroupNavigation';
import { GroupRoutes } from '../navigations/routes';

const GroupCallSettingsScreen = () => {
  const {
    navigation: { navigate },
  } = useGroupNavigation<GroupRoutes.SETTINGS>();
  const { currentUser, setCurrentUser } = useAuthContext();

  if (!currentUser) return null;

  return (
    <SettingsView
      userId={currentUser.userId}
      nickname={currentUser.nickname}
      profileUrl={currentUser.profileUrl}
      onPressApplicationInformation={() => navigate(GroupRoutes.APP_INFO)}
      onPressSignOut={async () => {
        await SendbirdCalls.deauthenticate().then(() => {
          setCurrentUser(undefined);
          AuthManager.deAuthenticate();
        });
      }}
    />
  );
};

export default GroupCallSettingsScreen;
