import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  FlatList
} from 'react-native'

import { Picker } from '@react-native-community/picker'

import { axiosTMDB } from '../../config/axios';

import {
  Container,
  List
} from '../UI';

export default function Discovery () {
  const [fetch, setFetch] = useState(false);
  const [payload, setPayload] = useState([]);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');

  async function discoverMovies () {
    try {
      setError('');
      setFetch(true);
      const response = await axiosTMDB.get(`/discover/movie?language=en-US&sort_by=${sortBy}&include_adult=false&include_video=false&with_genres=&with_cast=&with_keywords=&primary_release_year=2020&page=1`);
      setPayload(response.data.results);
    } catch (err) {
      setError('Looks like Thanos snapped his fingers!')
    } finally {
      setFetch(false);
    }
  }

  useEffect(() => {
    discoverMovies();
  }, []);

  function sortByHandler (value) {
    setSortBy(value);
    discoverMovies();
  }

  return (
    <Container>
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

      {!fetch
        && (
          <View style={{
            flex: 1,
            position: 'relative',
            justifyContent: 'center',
            margin: 10
          }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              keyExtractor={item => item.id.toString()}
              data={payload}
              renderItem={({ item }) => {
                return (
                  <List
                    route="TitleDetails"
                    id={item.id}
                    type="movie"
                    image={item.poster_path}
                    badge
                    badgeText="Movie"
                    title={item.title}
                    date={item.release_date}
                    body={item.overview}
                  />
                )
              }}
            />
          </View>
        )}
    </Container>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    margin: 10
  },
  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20
  },
  body: {
    color: '#737373',
    fontSize: 18,
    margin: 10
  },
  textInput: {
    padding: 5,
    borderWidth: 1,
    borderColor: 'white',
    color: 'white',
    marginBottom: 10
  }
})
