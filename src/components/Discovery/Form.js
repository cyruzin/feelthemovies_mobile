import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

import { Text, Badge } from '../UI';

import Search from './Search';

import { sortByResult, genresResult } from './values';

const handleYears = (range = 1900) => {
  const time = new Date();
  let years = [];

  for (let i = time.getFullYear(); i >= range; i--) {
    years.push(i);
  }

  return years;
}

const generateYears = handleYears();

export default function Form (props) {
  const {
    year,
    yearFocus,
    yearHandler,
    yearRemoveHandler,
    yearFocusHandler,
    sortByVal,
    sortByHandler,
    sortByFocus,
    sortByFocusHandler,
    sortyByRemoveHandler,
    genres,
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

  const KeyboardDismiss = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.content}>
      <Text style={styles.textLabel}>Year</Text>
      <KeyboardDismiss>
        <TextInput
          placeholder="Touch to select"
          placeholderTextColor="#737373"
          style={styles.textInput}
          value=""
          onFocus={yearFocusHandler}
          onBlur={() => yearFocusHandler(false)}
        />
      </KeyboardDismiss>
      {year !== ''
        && <View style={styles.badgeContent}>
          <TouchableOpacity onPress={() => yearRemoveHandler()}>
            <Badge style={styles.badge}>
              <Text style={styles.badgeTitle}>{year}</Text>
            </Badge>
          </TouchableOpacity>
        </View>}
      {yearFocus && <Search result={generateYears} onPress={yearHandler} />}

      <Text style={styles.textLabel}>Sort by</Text>
      <KeyboardDismiss>
        <TextInput
          placeholder="Touch to select"
          placeholderTextColor="#737373"
          value=""
          style={styles.textInput}
          onFocus={sortByFocusHandler}
          onBlur={() => sortByFocusHandler(false)}
        />
      </KeyboardDismiss>
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
      <KeyboardDismiss>
        <TextInput
          placeholder="Touch to select"
          placeholderTextColor="#737373"
          value=""
          style={styles.textInput}
          onFocus={genresFocusHandler}
          onBlur={() => genresFocusHandler(false)}
        />
      </KeyboardDismiss>
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
