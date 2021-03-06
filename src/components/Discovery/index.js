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
  Message,
  ScrollTop
} from '../UI';

import Form from './Form';

export default class Discovery extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      fetch: false,
      refreshing: false,
      payload: [],
      error: '',
      year: new Date().getFullYear().toString(),
      yearFocus: false,
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
      keywords: [],
      keywordsFocus: false,
      keywordsVal: '',
      keywordsSearch: [],
      page: 1,
      lastPage: 0,
      screenPosition: 0,
      scroll: false
    };

    this.scrollRef = React.createRef();
  }

  componentDidMount () {
    this.discoverMovies();
  }

  discoverMovies = async () => {
    try {
      const {
        year,
        genres,
        sortByVal,
        page,
        cast,
        keywords,
        payload,
        scroll
      } = this.state;

      this.setState({ error: '', fetch: !scroll && true });

      const withCast = cast.length > 0 ? cast.map(item => item.id).join(',') : '';
      const withGenres = genres.length > 0 ? genres.map(item => item.value).join(',') : '';
      const withKeywords = keywords.length > 0 ? keywords.map(item => item.id).join(',') : '';

      const response = await axiosTMDB.get(`/discover/movie?language=en-US&sort_by=${sortByVal.value}&include_adult=false&include_video=false&with_genres=${withGenres}&with_cast=${withCast}&with_keywords=${withKeywords}&primary_release_year=${year}&page=${page}`);

      if (!scroll) {
        this.setState({
          payload: response.data.results,
          lastPage: response.data.total_pages
        });
      } else {
        this.setState({
          payload: [...payload, ...response.data.results],
          lastPage: response.data.total_pages
        });
      }
    } catch (err) {
      this.setState({
        error: 'Looks like Thanos snapped his fingers!'
      })
    } finally {
      this.setState({
        fetch: false,
        refreshing: false,
        scroll: false
      })
    }
  }

  yearHandler = (year) => {
    this.setState({
      year: year.toString(),
      yearFocus: false
    }, () => this.discoverMovies());
  }

  yearRemoveHandler = () => {
    this.setState({ year: '' }, () => this.discoverMovies());
  }

  yearFocusHandler = (focusOut) => {
    const onFocus = focusOut ? true : false;
    this.setState({ yearFocus: onFocus });
  }

  genresHandler = (genres) => {
    const newGenres = this.state.genres.filter(item => item.value !== genres.value);
    this.setState({
      genres: [...newGenres, genres],
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
    const newCast = this.state.cast.filter(item => item.id !== id);
    this.setState({
      cast: [...newCast, { id, name }],
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

  fetchKeywords = (searchTerm) => {
    try {
      if (searchTerm === '') {
        this.setState({ keywordsSearch: [], keywordsVal: '' });
        return;
      }
      this.setState({ keywordsVal: searchTerm }, debounce(async () => {
        const response = await axiosTMDB.get(`/search/keyword?query=${encodeURIComponent(searchTerm)}&page=1`);
        this.setState({ keywordsSearch: response.data.results });
      }, 800));
    } catch (err) {
      this.setState({
        error: 'Looks like Thanos snapped his fingers!'
      })
    } finally {
      this.setState({ fetch: false })
    }
  }

  keywordsHandler = (keywords) => {
    const { id, name } = keywords;
    const newKeywords = this.state.keywords.filter(item => item.id !== id);
    this.setState({
      keywords: [...newKeywords, { id, name }],
      keywordsVal: '',
      keywordsSearch: []
    }, () => this.discoverMovies());
  }

  keywordsRemoveHandler = (id) => {
    const newKeywords = this.state.keywords.filter(item => item.id !== id);
    this.setState({
      keywords: newKeywords,
      keywordsVal: '',
      keywordsSearch: []
    }, () => this.discoverMovies());
  }

  keywordsFocusHandler = (focusOut) => {
    const onFocus = focusOut ? true : false;
    this.setState({ keywordsFocus: onFocus });
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

  scrollHandler = () => {
    const { page, lastPage } = this.state;

    if (page < lastPage) {
      this.setState(
        {
          page: page + 1,
          scroll: true,
        },
        () => this.discoverMovies(),
      );
    }
  }

  scrollTopHandler = () => {
    this.scrollRef.current.scrollToOffset({ x: 0, y: 0, animated: true });
  }

  render () {
    const {
      fetch,
      payload,
      refreshing,
      year,
      yearFocus,
      sortByVal,
      sortByFocus,
      genres,
      genresVal,
      genresFocus,
      cast,
      castFocus,
      castVal,
      castSearch,
      keywords,
      keywordsFocus,
      keywordsVal,
      keywordsSearch,
      screenPosition,
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
                    yearFocus={yearFocus}
                    yearHandler={this.yearHandler}
                    yearRemoveHandler={this.yearRemoveHandler}
                    yearFocusHandler={this.yearFocusHandler}
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
                    fetchCast={this.fetchCast}
                    cast={cast}
                    castVal={castVal}
                    castFocus={castFocus}
                    castFocusHandler={this.castFocusHandler}
                    castSearch={castSearch}
                    castHandler={this.castHandler}
                    castRemoveHandler={this.castRemoveHandler}
                    fetchKeywords={this.fetchKeywords}
                    keywords={keywords}
                    keywordsVal={keywordsVal}
                    keywordsFocus={keywordsFocus}
                    keywordsFocusHandler={this.keywordsFocusHandler}
                    keywordsSearch={keywordsSearch}
                    keywordsHandler={this.keywordsHandler}
                    keywordsRemoveHandler={this.keywordsRemoveHandler}
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
                ref={this.scrollRef}
                onScroll={event => this.setState({
                  screenPosition: event.nativeEvent.contentOffset.y
                })}
                onEndReachedThreshold={0.5}
                onEndReached={this.scrollHandler}
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
              {screenPosition >= 420 && <ScrollTop onPress={this.scrollTopHandler} />}
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
