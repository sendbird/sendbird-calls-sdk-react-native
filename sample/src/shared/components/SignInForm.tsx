import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import Palette from '../styles/palette';
import SBButton from './SBButton';
import SBIcon from './SBIcon';
import SBText from './SBText';
import SBTextInput from './SBTextInput';

type Props = {
  applicationId: string;
  userId: string;
  accessToken?: string;
  onChange: (value: { applicationId: string; userId: string; accessToken?: string }) => void;
  onSubmit: (value: { applicationId: string; userId: string; accessToken?: string }) => void;
  containerStyle?: StyleProp<ViewStyle>;
  hideApplicationId?: boolean;
};
const SignInForm = ({
  applicationId,
  userId,
  accessToken,
  onSubmit,
  onChange,
  containerStyle,
  hideApplicationId,
}: Props) => {
  return (
    <View style={containerStyle}>
      <View style={styles.logoContainer}>
        <SBIcon icon={'Sendbird'} size={48} />
        <SBText style={styles.logoTitle}>Sendbird Calls</SBText>
      </View>
      {!hideApplicationId && (
        <SBTextInput
          value={applicationId}
          onChangeText={(applicationId) => onChange({ applicationId, userId, accessToken })}
          placeholder={'Application ID'}
          style={styles.input}
        />
      )}
      <SBTextInput
        value={userId}
        onChangeText={(userId) => onChange({ applicationId, userId, accessToken })}
        placeholder={'User ID'}
        style={styles.input}
      />
      <SBTextInput
        value={accessToken}
        onChangeText={(accessToken) => onChange({ applicationId, userId, accessToken })}
        placeholder={'Access token (optional)'}
        style={styles.input}
      />
      <SBButton style={styles.button} onPress={() => onSubmit({ applicationId, userId, accessToken })}>
        {'Sign in'}
      </SBButton>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 34,
    marginTop: 48,
  },
  logoTitle: {
    marginTop: 30,
    fontWeight: 'bold',
    fontSize: 24,
    color: Palette.onBackgroundLight01,
  },
  input: {
    height: 56,
    marginBottom: 16,
  },
  button: {
    height: 48,
    borderRadius: 4,
    marginTop: 16,
  },
});

export default SignInForm;
