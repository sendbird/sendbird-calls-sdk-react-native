import React from 'react';

import SettingsView from '../../../../shared/components/SettingsView';
import { useAuthContext } from '../../../../shared/contexts/AuthContext';
import { DirectRoutes } from '../../../navigations/routes';
import { useDirectNavigation } from '../../../navigations/useDirectNavigation';

const DirectCallSettingsScreen = () => {
  const { navigation } = useDirectNavigation<DirectRoutes.SETTINGS>();
  const { currentUser, setCurrentUser } = useAuthContext();

  if (!currentUser) return null;

  return (
    <SettingsView
      userId={currentUser.userId}
      nickname={currentUser.nickname}
      profileUrl={currentUser.profileUrl}
      onPressApplicationInformation={() => navigation.navigate(DirectRoutes.APP_INFO)}
      onPressSignOut={() => setCurrentUser(undefined)}
    />
  );
};

export default DirectCallSettingsScreen;
