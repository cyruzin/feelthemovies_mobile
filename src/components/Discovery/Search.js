import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { Text } from '../UI';

export default function Search (props) {
  const { result, onPress } = props;

  return result.length > 0 && (
    <View style={styles.content}>
      {result.slice(0, 20).map(value => (
        <TouchableOpacity
          key={value.id}
          style={{ marginBottom: 10 }}
          onPress={() => onPress(value)}
        >
          <Text style={styles.title}>
            {value.name}
          </Text>
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
    backgroundColor: '#1b1919',
    borderRadius: 5
  },
  title: {
    fontSize: 17,
    color: '#737373'
  }
})
