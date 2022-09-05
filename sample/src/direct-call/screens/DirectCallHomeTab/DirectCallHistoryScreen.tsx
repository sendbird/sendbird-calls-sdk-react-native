import React, { useCallback } from 'react';
import { Alert, FlatList, View } from 'react-native';

import { DirectCallProperties, SendbirdCalls } from '@sendbird/calls-react-native';

import Loading from '../../../shared/components/Loading';
import SBIcon from '../../../shared/components/SBIcon';
import SBText from '../../../shared/components/SBText';
import { useAuthContext } from '../../../shared/contexts/AuthContext';
import Palette from '../../../shared/styles/palette';
import { AppLogger } from '../../../shared/utils/logger';
import CallHistoryCell from '../../components/CallHistoryCell';
import { useRemoteHistory } from '../../hooks/useCallHistory';
import { DirectRoutes } from '../../navigations/routes';
import { useDirectNavigation } from '../../navigations/useDirectNavigation';

const DirectCallHistoryScreen = () => {
  const { currentUser } = useAuthContext();
  const { navigation } = useDirectNavigation<DirectRoutes.HISTORY>();

  // const { onRefresh, refreshing, history, loading } = useLocalHistory();
  const { onRefresh, refreshing, history, loading, onEndReached } = useRemoteHistory();

  if (!currentUser) return null;

  const onNavigate = (callProps: DirectCallProperties) => {
    if (callProps.isVideoCall) {
      navigation.navigate(DirectRoutes.VIDEO_CALLING, { callId: callProps.callId });
    } else {
      navigation.navigate(DirectRoutes.VOICE_CALLING, { callId: callProps.callId });
    }
  };

  const onDial = useCallback(async (userId: string, isVideoCall: boolean) => {
    try {
      const callProps = await SendbirdCalls.dial(userId, isVideoCall);
      AppLogger.info('DIAL CALLED', callProps.callId);
      onNavigate(callProps);
    } catch (e) {
      // @ts-ignore
      Alert.alert('Failed', e.message);
    }
  }, []);

  return (
    <React.Fragment>
      <FlatList
        data={history}
        keyExtractor={(item) => item.callId}
        renderItem={({ item }) => <CallHistoryCell onDial={onDial} history={item} />}
        ListEmptyComponent={<EmptyList />}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
      />
      <Loading visible={loading} />
    </React.Fragment>
  );
};

const EmptyList = () => {
  return (
    <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
      <SBIcon
        icon={'CallHistory'}
        size={60}
        color={Palette.onBackgroundLight03}
        containerStyle={{ marginBottom: 20 }}
      />
      <SBText body3 color={Palette.onBackgroundLight03} style={{ textAlign: 'center' }}>
        {'The list of calls you make will show here.\n' + 'Tap the phone button to start making a call.'}
      </SBText>
    </View>
  );
};

export default DirectCallHistoryScreen;
