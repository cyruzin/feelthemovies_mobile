import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';

import { Text, Badge } from '../UI';

import Search from './Search';

export default function Form (props) {
  const {
    year,
    yearHandler,
    sortBy,
    sortByHandler,
    castVal,
    cast,
    castSearch,
    castHandler,
    castRemoveHandler,
    fetchCast
  } = props;

  return (
    <View style={styles.content}>
      <Text style={styles.textLabel}>Year</Text>
      <TextInput
        placeholder="Type a year"
        placeholderTextColor="#737373"
        style={styles.textInput}
        keyboardType="numeric"
        defaultValue={year}
        onChangeText={value => yearHandler(value)}
      />
      <Text style={styles.textLabel}>Sort by</Text>
      <TextInput
        placeholder="Touch to select"
        placeholderTextColor="#737373"
        style={styles.textInput}
      />
      <Text style={styles.textLabel}>Genres</Text>
      <TextInput
        placeholder="Touch to select"
        placeholderTextColor="#737373"
        style={styles.textInput}
      />
      <Text style={styles.textLabel}>Cast</Text>
      <TextInput
        placeholder="Type a cast"
        value={castVal}
        placeholderTextColor="#737373"
        onChangeText={fetchCast}
        style={styles.textInput}
      />
      {cast.length > 0 &&
        <View style={styles.castContent}>
          {cast.map(cast => (
            <TouchableOpacity key={cast.id} onPress={() => castRemoveHandler(cast.id)}>
              <Badge style={styles.castBadge}>
                <Text style={styles.castTitle}>{cast.name}</Text>
              </Badge>
            </TouchableOpacity>
          ))}
        </View>}
      <Search result={castSearch} onPress={castHandler} />
      <Text style={styles.textLabel}>Keywords</Text>
      <TextInput
        placeholder="Type a keyword"
        placeholderTextColor="#737373"
        style={styles.textInput}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  textLabel: {
    marginBottom: 5,
    marginLeft: 3,
    fontSize: 13,
    color: '#fff'
  },
  textInput: {
    padding: 5,
    color: 'white',
    backgroundColor: '#1b1919',
    borderRadius: 5,
    marginBottom: 10
  },
  castContent: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center'
  },
  castBadge: {
    borderRadius: 8,
    padding: 5,
    marginRight: 10
  },
  castTitle: {
    color: '#fff'
  }
})
