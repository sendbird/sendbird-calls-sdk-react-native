import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import Palette from '../styles/palette';
import Typography from '../styles/typography';

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

  return (
    <View style={styles.container}>
      <View style={[styles.headerTitle, headerLeftType !== HeaderLeftTypes.NONE && { alignItems: 'center' }]}>
        <Text style={Typography.h1}>{title}</Text>
      </View>
      {(() => {
        switch (headerLeftType) {
          case HeaderLeftTypes.BACK:
            return (
              canGoBack() && (
                <Pressable onPress={goBack}>
                  <Image
                    source={require('../../assets/iconBack.png')}
                    style={[styles.icon, { marginRight: 16, tintColor: Palette.primary300 }]}
                  />
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
    height: 44,
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
  icon: {
    width: 24,
    height: 24,
  },
});

export default Header;
