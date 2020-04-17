import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from 'react-native'

import { axiosTMDB } from '../../config/axios';

import debounce from 'lodash/debounce';

import {
  Container,
  List,
  Message
} from '../UI';

import Form from './Form';

export default class Discovery extends Component {
  state = {
    fetch: false,
    refreshing: false,
    payload: [],
    error: '',
    year: new Date().getFullYear().toString(),
    sortBy: 'popularity.desc',
    castVal: '',
    castSearch: [],
    cast: [],
    page: 1
  };

  componentDidMount () {
    this.discoverMovies();
  }

  discoverMovies = async () => {
    try {
      this.setState({ error: '', fetch: true });
      const {
        year,
        sortBy,
        page,
        cast
      } = this.state;

      const withCast = cast.length > 0 ? cast.map(value => value.id).join(',') : '';

      const response = await axiosTMDB.get(`/discover/movie?language=en-US&sort_by=${sortBy}&include_adult=false&include_video=false&with_genres=&with_cast=${withCast}&with_keywords=&primary_release_year=${year}&page=${page}`);
      this.setState({ payload: response.data.results });
    } catch (err) {
      this.setState({
        error: 'Looks like Thanos snapped his fingers!'
      })
    } finally {
      this.setState({
        fetch: false,
        refreshing: false
      })
    }
  }

  yearHandler = debounce((year) => {
    this.setState({ year }, () => this.discoverMovies());
  }, 800);

  fetchCast = (searchTerm) => {
    try {
      if (searchTerm === '') {
        this.setState({ castSearch: [], castVal: '' });
        return;
      }
      this.setState({ castVal: searchTerm }, debounce(async () => {
        const response = await axiosTMDB.get(`/search/person?language=en-US&query=${encodeURIComponent(searchTerm)}&page=1&include_adult=false`);
        this.setState({ castSearch: response.data.results });
      }, 800));
    } catch (err) {
      this.setState({
        error: 'Looks like Thanos snapped his fingers!'
      })
    } finally {
      this.setState({ fetch: false })
    }
  }

  castHandler = (cast) => {
    const { id, name } = cast;
    this.setState({
      cast: [...this.state.cast, { id, name }],
      castVal: '',
      castSearch: []
    }, () => this.discoverMovies());
  }

  castRemoveHandler = (id) => {
    const newCast = this.state.cast.filter(item => item.id !== id);
    this.setState({
      cast: newCast,
      castVal: '',
      castSearch: []
    }, () => this.discoverMovies());
  }

  sortByHandler = (value) => {
    this.setState({ sortBy: value }, () => this.discoverMovies());
  }

  refreshHandler = () => {
    this.setState({
      refreshing: true
    },
      () => this.discoverMovies()
    );
  }

  render () {
    const {
      fetch,
      payload,
      refreshing,
      year,
      yearHandler,
      sortBy,
      cast,
      castVal,
      castSearch,
      error
    } = this.state;

    return (
      <Container>
        {fetch && <ActivityIndicator size="large" color="#737373" />}

        {error !== '' ? <Message text={error} /> : null}

        {!fetch
          && (
            <View style={{
              flex: 1,
              position: 'relative',
              justifyContent: 'center',
              margin: 10
            }}>
              <FlatList
                ListHeaderComponent={
                  <Form
                    year={year}
                    yearHandler={this.yearHandler}
                    sortBy={sortBy}
                    sortByHandler={this.sortByHandler}
                    cast={cast}
                    castVal={castVal}
                    castSearch={castSearch}
                    castHandler={this.castHandler}
                    castRemoveHandler={this.castRemoveHandler}
                    fetchCast={this.fetchCast}
                  />
                }
                refreshControl={
                  <RefreshControl
                    progressBackgroundColor="#0f0e0e"
                    colors={['#0093cb', '#737373']}
                    refreshing={refreshing}
                    onRefresh={this.refreshHandler}
                  />
                }
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                keyExtractor={item => item.id.toString()}
                data={payload}
                ListEmptyComponent={<Message text="No Result" />}
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
  }
})
