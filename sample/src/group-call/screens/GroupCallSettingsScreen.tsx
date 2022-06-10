import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import SettingsView from '../../shared/components/SettingsView';
import { useAuthContext } from '../../shared/contexts/AuthContext';
import type { GroupCallSettingStackParamList } from '../navigations/navigatorTypes';
import { GroupRoutes } from '../navigations/routes';

type SettingsScreenNavigationProps = NativeStackNavigationProp<GroupCallSettingStackParamList>;
type GroupCallSettingsScreenProps = {
  navigation: SettingsScreenNavigationProps;
};

const GroupCallSettingsScreen = ({ navigation: { navigate } }: GroupCallSettingsScreenProps) => {
  const { currentUser, setCurrentUser } = useAuthContext();

  if (!currentUser) return null;

  return (
    <SettingsView
      userId={currentUser.userId}
      nickname={currentUser.nickname}
      profileUrl={currentUser.profileUrl}
      onPressApplicationInformation={() => navigate(GroupRoutes.APP_INFO)}
      onPressSignOut={() => setCurrentUser(undefined)}
    />
  );
};

export default GroupCallSettingsScreen;
