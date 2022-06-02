import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import SBButton from './SBButton';
import SBTextInput from './SBTextInput';

type Props = {
  applicationId: string;
  userId: string;
  accessToken?: string;
  onChange: (value: { applicationId: string; userId: string; accessToken?: string }) => void;
  onSubmit: (value: { applicationId: string; userId: string; accessToken?: string }) => void;
  containerStyle?: StyleProp<ViewStyle>;
};
const SignInForm = ({ applicationId, userId, accessToken, onSubmit, onChange, containerStyle }: Props) => {
  return (
    <View style={containerStyle}>
      <SBTextInput
        value={applicationId}
        onChangeText={(applicationId) => onChange({ applicationId, userId, accessToken })}
        placeholder={'Application ID'}
        style={styles.input}
      />
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
  input: {
    height: 56,
    marginBottom: 16,
  },
  button: {
    height: 48,
  },
});

export default SignInForm;
