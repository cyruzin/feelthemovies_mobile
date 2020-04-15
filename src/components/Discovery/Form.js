import React from 'react';
import {
  StyleSheet,
  View,
  TextInput
} from 'react-native';

import { Picker } from '@react-native-community/picker';

export default function Form (props) {
  const {
    sortBy,
    sortByHandler
  } = props;

  return (
    <View style={styles.content}>
      <TextInput
        placeholder="Year"
        placeholderTextColor="#737373"
        defaultValue={new Date().getFullYear().toString()}
        style={styles.textInput}
      />
      <Picker
        selectedValue={sortBy}
        style={{
          height: 50,
          width: 400,
          color: '#737373'
        }}
        onValueChange={(itemValue) => sortByHandler(itemValue)}
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
        placeholderTextColor="#737373"
        style={styles.textInput}
      />
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
  }
})
