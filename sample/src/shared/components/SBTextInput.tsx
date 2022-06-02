import React from 'react';
import { TextInput as RNTextInput, StyleSheet, TextInputProps } from 'react-native';

import Palette from '../styles/palette';
import Typography from '../styles/typography';

const inputStyles = {
  default: {
    active: {
      text: Palette.onBackgroundLight01,
      placeholder: Palette.onBackgroundLight03,
      background: Palette.background100,
      highlight: Palette.primary300,
    },
    disabled: {
      text: Palette.onBackgroundLight04,
      placeholder: Palette.onBackgroundLight04,
      background: Palette.background100,
      highlight: Palette.onBackgroundLight04,
    },
  },
  underline: {
    active: {
      text: Palette.onBackgroundLight01,
      placeholder: Palette.onBackgroundLight03,
      background: Palette.transparent,
      highlight: Palette.primary300,
    },
    disabled: {
      text: Palette.onBackgroundLight04,
      placeholder: Palette.onBackgroundLight04,
      background: Palette.transparent,
      highlight: Palette.onBackgroundLight04,
    },
  },
};

type Props = { variant?: keyof typeof inputStyles } & TextInputProps;
const SBTextInput = React.forwardRef<RNTextInput, Props>(function TextInput(
  { children, style, variant = 'default', editable = true, ...props },
  ref,
) {
  const variantStyle = inputStyles[variant];
  const inputStyle = editable ? variantStyle.active : variantStyle.disabled;
  const underlineStyle = variant === 'underline' && { borderBottomWidth: 2, borderBottomColor: inputStyle.highlight };

  return (
    <RNTextInput
      ref={ref}
      editable={editable}
      selectionColor={inputStyle.highlight}
      placeholderTextColor={inputStyle.placeholder}
      style={[
        Typography.body3,
        styles.input,
        { color: inputStyle.text, backgroundColor: inputStyle.background },
        underlineStyle,
        style,
      ]}
      {...props}
    >
      {children}
    </RNTextInput>
  );
});

const styles = StyleSheet.create({
  input: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default SBTextInput;
