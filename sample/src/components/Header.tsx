import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
        <Text style={styles.title}>{title}</Text>
      </View>
      {(() => {
        switch (headerLeftType) {
          case HeaderLeftTypes.BACK:
            return (
              canGoBack() && (
                <Pressable onPress={goBack}>
                  <Text>back</Text>
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
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: '600',
  },
});

export default Header;
