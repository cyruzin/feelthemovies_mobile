import React from 'react';
import {
  StyleSheet,
  View,
  TextInput
} from 'react-native';

import { Picker } from '@react-native-community/picker';

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
    fetchCast
  } = props;

  return (
    <View style={styles.content}>
      <TextInput
        placeholder="Year"
        placeholderTextColor="#737373"
        style={styles.textInput}
        keyboardType="numeric"
        defaultValue={year}
        onChangeText={value => yearHandler(value)}
      />
      <Picker
        selectedValue={sortBy}
        style={{
          height: 50,
          width: 400,
          color: '#737373'
        }}
        onValueChange={itemValue => sortByHandler(itemValue)}
        itemStyle={{
          backgroundColor: 'red'
        }}
      >
        <Picker.Item
          color="white"
          value="popularity.desc"
          label="Popularity Descending"
        />
        <Picker.Item
          color="white"
          value="popularity.asc"
          label="Popularity Ascending"
        />
      </Picker>
      <TextInput
        placeholder="Genres"
        placeholderTextColor="#737373"
        style={styles.textInput}
      />
      <TextInput
        placeholder="Cast"
        value={castVal}
        placeholderTextColor="#737373"
        onChangeText={fetchCast}
        style={styles.textInput}
      />
      {cast.length > 0 &&
        <View style={styles.castContent}>
          {cast.map(cast => (
            <Badge key={cast.id} style={styles.castBadge}>
              <Text style={styles.castTitle}>{cast.name}</Text>
            </Badge>
          ))}
        </View>}
      <Search result={castSearch} onPress={castHandler} />
      <TextInput
        placeholder="Keywords"
        placeholderTextColor="#737373"
        style={styles.textInput}
      />
    </View>
  )
}

const styles = StyleSheet.create({
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
