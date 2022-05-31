import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export enum HeaderLeftType {
  NONE = 'NONE',
  BACK = 'BACK',
  CANCEL = 'CANCEL',
}

interface IHeaderLeftProps {
  title: string;
  headerLeftType?: HeaderLeftType;
}

const Header = ({ title, headerLeftType = HeaderLeftType.NONE }: IHeaderLeftProps) => {
  return (
    <View style={styles.container}>
      <View style={[styles.headerTitle, headerLeftType !== HeaderLeftType.NONE && { alignItems: 'center' }]}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {(() => {
        switch (headerLeftType) {
          case HeaderLeftType.BACK:
            return (
              <Pressable>
                <Text>back</Text>
              </Pressable>
            );
          case HeaderLeftType.CANCEL:
            return (
              <Pressable>
                <Text>cancel</Text>
              </Pressable>
            );
          default: // HeaderLeftType.NONE
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
