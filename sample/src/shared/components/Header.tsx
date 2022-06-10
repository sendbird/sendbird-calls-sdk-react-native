import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DEFAULT_HEADER_HEIGHT } from '../constants';
import Palette from '../styles/palette';
import SBIcon from './SBIcon';
import SBText from './SBText';

export enum HeaderLeftTypes {
  NONE = 'NONE',
  BACK = 'BACK',
  CANCEL = 'CANCEL',
}

interface IHeaderLeftProps {
  title: string;
  headerLeftType?: HeaderLeftTypes;
}

const Header = ({ title, headerLeftType = HeaderLeftTypes.NONE }: IHeaderLeftProps) => {
  const { goBack, canGoBack } = useNavigation();
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: top, height: DEFAULT_HEADER_HEIGHT + top }]}>
      <View style={[styles.headerTitle, { top }, headerLeftType !== HeaderLeftTypes.NONE && { alignItems: 'center' }]}>
        <SBText h1>{title}</SBText>
      </View>
      {(() => {
        switch (headerLeftType) {
          case HeaderLeftTypes.BACK:
            return (
              canGoBack() && (
                <Pressable onPress={goBack}>
                  <SBIcon icon={'Back'} color={Palette.primary300} containerStyle={{ marginRight: 16 }} />
                </Pressable>
              )
            );
          case HeaderLeftTypes.CANCEL:
            return (
              <Pressable>
                <Text>cancel</Text>
              </Pressable>
            );
          default: // HeaderLeftTypes.NONE
            return null;
        }
      })()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.background50,
    borderBottomWidth: 1,
    borderBottomColor: Palette.background100,
  },
  headerTitle: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
});

export default Header;
