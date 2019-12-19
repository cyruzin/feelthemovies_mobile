import React from 'react';
import {View, StyleSheet} from 'react-native';

export default props => {
  const {style, children} = props;
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#0f0e0e',
    justifyContent: 'center',
  },
});
