import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { Title } from '../UI';

export default function Search (props) {
  const { result, onPress } = props;

  return result.length > 0 && (
    <View style={styles.content}>
      {result.slice(0, 20).map(value => (
        <TouchableOpacity
          key={value.id}
          onPress={() => onPress(value)}
        >
          <Title style={styles.title}>
            {value.name}
          </Title>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#737373'
  },
  title: {
    fontSize: 17,
    color: '#fff'
  }
})
