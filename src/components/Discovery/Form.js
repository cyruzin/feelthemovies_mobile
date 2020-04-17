import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';

import { Text, Badge } from '../UI';

import Search from './Search';

import { sortByResult, genresResult } from './values';

export default function Form (props) {
  const {
    year,
    yearHandler,
    sortByVal,
    sortByHandler,
    sortByFocus,
    sortByFocusHandler,
    sortyByRemoveHandler,
    genres,
    genresVal,
    genresFocus,
    genresHandler,
    genresFocusHandler,
    genresRemoveHandler,
    castVal,
    fetchCast,
    cast,
    castFocus,
    castFocusHandler,
    castSearch,
    castHandler,
    castRemoveHandler,
    fetchKeywords,
    keywords,
    keywordsVal,
    keywordsFocus,
    keywordsFocusHandler,
    keywordsHandler,
    keywordsSearch,
    keywordsRemoveHandler
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
        onFocus={sortByFocusHandler}
        onBlur={() => sortByFocusHandler(false)}
      />
      {sortByVal.name
        && <View style={styles.badgeContent}>
          <TouchableOpacity onPress={() => sortyByRemoveHandler()}>
            <Badge style={styles.badge}>
              <Text style={styles.badgeTitle}>{sortByVal.name}</Text>
            </Badge>
          </TouchableOpacity>
        </View>}
      {sortByFocus && <Search result={sortByResult} onPress={sortByHandler} />}

      <Text style={styles.textLabel}>Genres</Text>
      <TextInput
        placeholder="Touch to select"
        placeholderTextColor="#737373"
        style={styles.textInput}
        onFocus={genresFocusHandler}
        onBlur={() => genresFocusHandler(false)}
      />
      {genres.length > 0 &&
        <View style={styles.badgeContent}>
          {genres.map(genre => (
            <TouchableOpacity key={genre.id} onPress={() => genresRemoveHandler(genre.id)}>
              <Badge style={styles.badge}>
                <Text style={styles.badgeTitle}>{genre.name}</Text>
              </Badge>
            </TouchableOpacity>
          ))}
        </View>}
      {genresFocus && <Search result={genresResult} onPress={genresHandler} />}


      <Text style={styles.textLabel}>Cast</Text>
      <TextInput
        placeholder="Type a cast"
        value={castVal}
        placeholderTextColor="#737373"
        style={styles.textInput}
        onChangeText={fetchCast}
        onFocus={castFocusHandler}
        onBlur={() => castFocusHandler(false)}
      />
      {cast.length > 0 &&
        <View style={styles.badgeContent}>
          {cast.map(cast => (
            <TouchableOpacity key={cast.id} onPress={() => castRemoveHandler(cast.id)}>
              <Badge style={styles.badge}>
                <Text style={styles.badgeTitle}>{cast.name}</Text>
              </Badge>
            </TouchableOpacity>
          ))}
        </View>}
      {castFocus && <Search result={castSearch} onPress={castHandler} />}

      <Text style={styles.textLabel}>Keywords</Text>
      <TextInput
        placeholder="Type a keyword"
        value={keywordsVal}
        placeholderTextColor="#737373"
        style={styles.textInput}
        onChangeText={fetchKeywords}
        onFocus={keywordsFocusHandler}
        onBlur={() => keywordsFocusHandler(false)}
      />
      {keywords.length > 0 &&
        <View style={styles.badgeContent}>
          {keywords.map(keyword => (
            <TouchableOpacity key={keyword.id} onPress={() => keywordsRemoveHandler(keyword.id)}>
              <Badge style={styles.badge}>
                <Text style={styles.badgeTitle}>{keyword.name}</Text>
              </Badge>
            </TouchableOpacity>
          ))}
        </View>}
      {keywordsFocus && <Search result={keywordsSearch} onPress={keywordsHandler} />}
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
  badgeContent: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    alignItems: 'center'
  },
  badge: {
    borderRadius: 8,
    padding: 5,
    marginRight: 10,
    marginTop: 7
  },
  badgeTitle: {
    color: '#fff'
  }
})
