import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from 'react-native'

import { axiosTMDB } from '../../config/axios';

import {
  Container,
  List
} from '../UI';

import Form from './Form';

export default class Discovery extends Component {
  state = {
    fetch: false,
    refreshing: false,
    payload: [],
    error: '',
    sortBy: 'popularity.desc',
    page: 1
  };

  componentDidMount () {
    this.discoverMovies();
  }

  discoverMovies = async () => {
    try {
      this.setState({ error: '', fetch: true });
      const {
        sortBy,
        page
      } = this.state;
      const response = await axiosTMDB.get(`/discover/movie?language=en-US&sort_by=${sortBy}&include_adult=false&include_video=false&with_genres=&with_cast=&with_keywords=&primary_release_year=2020&page=${page}`);
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
    const { fetch, payload, sortBy, refreshing } = this.state;
    return (
      <Container>
        {fetch && <ActivityIndicator size="large" color="#737373" />}

        {!fetch
          && payload.length > 0
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
                    sortBy={sortBy}
                    sortByHandler={this.sortByHandler}
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
