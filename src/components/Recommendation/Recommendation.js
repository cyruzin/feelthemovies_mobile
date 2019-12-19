import React, {PureComponent} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import moment from 'moment';
import uuidv4 from 'uuid/v4';

import axios from '../../config/axios';
import {limitChar} from '../../util/helpers';

import {Container, Message, Title, Text, List} from '../UI';

import RecommendationHeader from './RecommendationHeader';
import RecommendationFooter from './RecommendationFooter';

export default class Recommendation extends PureComponent {
  state = {
    fetch: false,
    successful: false,
    failure: '',
    payload: [],
  };

  async componentDidMount() {
    this.getRecommendations();
  }

  async getRecommendations() {
    try {
      const {id} = this.props;
      this.setState({fetch: true});
      const res = await axios.get(`recommendation_items/${id}`);
      this.setState({
        payload: res.data.data,
        fetch: false,
        successful: true,
      });
    } catch (e) {
      this.setState({
        failure: 'Looks like Thanos snapped his fingers!',
        fetch: false,
      });
    }
  }

  render() {
    const {recommendation} = this.props;
    const {fetch, failure, successful, payload} = this.state;

    return (
      <Container>
        {fetch && <ActivityIndicator size="large" color="#737373" />}

        {failure !== '' ? <Message text={failure} /> : null}

        {successful && (
          <SafeAreaView>
            <FlatList
              ListHeaderComponent={
                <RecommendationHeader
                  recommendation={recommendation}
                  styles={styles}
                />
              }
              ListFooterComponent={
                <RecommendationFooter
                  recommendation={recommendation}
                  styles={styles}
                />
              }
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              data={payload}
              renderItem={({item}) => (
                <View>
                  <List
                    route="TitleDetails"
                    id={item.tmdb_id}
                    type={item.media_type}
                    recommendation={item}
                    image={item.poster}
                    title={item.name}
                    date={item.year}
                    body={limitChar(item.overview, 200, 170)}
                  />

                  {item.commentary !== '' ? (
                    <View style={styles.commentaryBox}>
                      <Text style={styles.commentaryText}>
                        <Icon name="format-quote" size={14} color="#fff" />
                        {item.commentary}
                      </Text>
                    </View>
                  ) : null}

                  {item.sources.length > 0 ? (
                    <View style={styles.sourcesBox}>
                      <Text style={styles.sourcesText}>Watch On:</Text>
                      <Text style={styles.sourcesSubText}>
                        {item.sources
                          .trim()
                          .split(', ')
                          .map(source => source)
                          .join(', ')}
                      </Text>
                    </View>
                  ) : null}
                </View>
              )}
            />
          </SafeAreaView>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0e0e',
    justifyContent: 'center',
  },
  header: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    margin: 10,
    marginTop: 15,
    marginBottom: 5,
    textAlign: 'center',
  },
  dateBox: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  date: {
    fontSize: 14,
    color: '#fff',
  },
  description: {
    marginBottom: 10,
    color: '#737373',
    fontSize: 18,
    textAlign: 'center',
  },
  genres: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  genresBox: {
    backgroundColor: '#0093cb',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 5,
    padding: 3,
  },
  genresText: {
    color: '#fff',
    fontSize: 14,
  },
  body: {
    flexDirection: 'column',
    margin: 10,
  },
  bodyBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
    marginTop: 20,
  },
  name: {
    color: '#fff',
    fontSize: 20,
  },
  overview: {
    color: '#737373',
    fontSize: 18,
    marginTop: 5,
  },
  commentaryBox: {
    margin: 10,
  },
  commentaryText: {
    fontSize: 16,
    color: '#737373',
    textAlign: 'center',
  },
  sourcesBox: {
    margin: 10,
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  sourcesText: {
    color: '#737373',
    marginRight: 5,
    fontSize: 16,
  },
  sourcesSubText: {
    color: '#fff',
    fontSize: 16,
  },
  keywordsBox: {
    margin: 5,
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  keywordsText: {
    color: '#fff',
    fontSize: 16,
    margin: 5,
  },
  keywordsHashTag: {
    fontSize: 16,
    color: '#0093cb',
  },
});
