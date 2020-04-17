import React, { PureComponent } from 'react'
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

export default class Discovery extends PureComponent {
  state = {
    fetch: false,
    refreshing: false,
    payload: [],
    error: '',
    year: new Date().getFullYear().toString(),
    sortByVal: {
      id: 1,
      name: 'Popularity Descending',
      value: 'popularity.desc'
    },
    sortByFocus: false,
    genresVal: '',
    genres: [],
    genresFocus: false,
    castVal: '',
    castFocus: false,
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
        genres,
        sortByVal,
        page,
        cast
      } = this.state;

      const withCast = cast.length > 0 ? cast.map(item => item.id).join(',') : '';
      const withGenres = genres.length > 0 ? genres.map(item => item.value).join(',') : '';

      const response = await axiosTMDB.get(`/discover/movie?language=en-US&sort_by=${sortByVal.value}&include_adult=false&include_video=false&with_genres=${withGenres}&with_cast=${withCast}&with_keywords=&primary_release_year=${year}&page=${page}`);
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

  genresHandler = (genres) => {
    this.setState({
      genres: [...this.state.genres, genres],
      genresVal: '',
      genresFocus: false
    }, () => this.discoverMovies());
  }

  genresRemoveHandler = (id) => {
    const newGenres = this.state.genres.filter(item => item.id !== id);
    this.setState({
      genres: newGenres,
      genresVal: ''
    }, () => this.discoverMovies());
  }

  genresFocusHandler = (focusOut) => {
    const onFocus = focusOut ? true : false;
    this.setState({ genresFocus: onFocus });
  }

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

  castFocusHandler = (focusOut) => {
    const onFocus = focusOut ? true : false;
    this.setState({ castFocus: onFocus });
  }

  sortyByRemoveHandler = () => {
    this.setState({ sortByVal: {} }, () => this.discoverMovies());
  }

  sortByFocusHandler = (focusOut) => {
    const onFocus = focusOut ? true : false;
    this.setState({ sortByFocus: onFocus });
  }

  sortByHandler = (value) => {
    this.setState({
      sortByVal: value,
      sortByFocus: false
    },
      () => this.discoverMovies());
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
      sortByVal,
      sortByFocus,
      genres,
      genresVal,
      genresFocus,
      cast,
      castFocus,
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
                    sortByVal={sortByVal}
                    sortByHandler={this.sortByHandler}
                    sortByFocus={sortByFocus}
                    sortByFocusHandler={this.sortByFocusHandler}
                    sortyByRemoveHandler={this.sortyByRemoveHandler}
                    genres={genres}
                    genresVal={genresVal}
                    genresFocus={genresFocus}
                    genresHandler={this.genresHandler}
                    genresFocusHandler={this.genresFocusHandler}
                    genresRemoveHandler={this.genresRemoveHandler}
                    cast={cast}
                    castVal={castVal}
                    castFocus={castFocus}
                    castFocusHandler={this.castFocusHandler}
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
