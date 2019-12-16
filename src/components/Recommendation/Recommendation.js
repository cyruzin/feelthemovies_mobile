import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    SafeAreaView,
    ActivityIndicator,
    FlatList
} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons'

import moment from 'moment'
import uuidv4 from 'uuid/v4'

import axios from '../../config/axios'
import { limitChar } from '../../util/helpers'

import {
    Container,
    Message,
    Title,
    Text,
    List
} from '../UI'

export default class Recommendation extends PureComponent {
    state = {
        fetch: false,
        successful: false,
        failure: '',
        payload: []
    }

    async componentDidMount() {
        try {
            const { id } = this.props
            this.setState({ fetch: true })
            const res = await axios.get(`recommendation_items/${id}`)
            this.setState({
                payload: res.data.data,
                fetch: false,
                successful: true
            })
        } catch (e) {
            this.setState({
                failure: 'Looks like Thanos snapped his fingers!',
                fetch: false
            })
        }
    }

    render() {
        const { recommendation } = this.props
        const {
            fetch, failure, successful, payload
        } = this.state

        return (
            <Container>

                {fetch && (
                    <ActivityIndicator
                      size="large"
                      color="#737373"
                    />
                )}

                {failure !== ''
                    ? <Message text={failure} />
                    : null}

                {successful
                    ? (
                        <SafeAreaView
                          showsVerticalScrollIndicator={false}
                        >

                            <View style={styles.header}>
                                <Title style={styles.title}>
                                    {recommendation.title}
                                </Title>
                                <View style={styles.dateBox}>
                                    <Text style={styles.date}>
                                        Created on
{' '}
                                        {moment(recommendation.created_at).format('MMMM Do YYYY \\at h:mm a')}
                                    </Text>
                                    <Text style={styles.date}>
                                        Updated on
{' '}
                                        {moment(recommendation.updated_at).format('MMMM Do YYYY \\at h:mm a')}
                                    </Text>
                                </View>
                                <View style={styles.genres}>
                                    {recommendation.genres.trim().split(', ')
                                        .map((genres) => (
                                            <View
                                              key={uuidv4()}
                                              style={styles.genresBox}
                                            >
                                                <Text style={styles.genresText}>
                                                    {genres}
                                                </Text>
                                            </View>
                                        ))}
                                </View>
                                <Text style={styles.description}>
                                    {recommendation.body}
                                </Text>
                            </View>


                            <View style={styles.body}>

                                <FlatList
                                  showsVerticalScrollIndicator={false}
                                  keyExtractor={(item) => item.id.toString()}
                                  data={payload}
                                  renderItem={({ item }) => (
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

                                            {item.commentary !== ''
                                                ? (
                                                    <View style={styles.commentaryBox}>
                                                        <Text style={styles.commentaryText}>
                                                            <Icon name="format-quote" size={14} color="#fff" />
                                                            {item.commentary}
                                                        </Text>
                                                    </View>
                                                )
                                                : null}

                                            {item.sources.length > 0
                                                ? (
                                                    <View style={styles.sourcesBox}>
                                                        <Text style={styles.sourcesText}>
                                                            Watch On:
                                                        </Text>
                                                        <Text style={styles.sourcesSubText}>
                                                            {item.sources.trim().split(', ')
                                                                .map((source) => source).join(', ')}
                                                        </Text>
                                                    </View>
                                                )
                                                : null}

                                        </View>
                                    )}
                                />
                            </View>

                            <View
                              style={styles.keywordsBox}
                            >
                                {recommendation.keywords.trim().split(', ')
                                    .map((keywords) => (
                                        <Text
                                          key={uuidv4()}
                                          style={styles.keywordsText}
                                        >
                                            <Title
                                              style={styles.keywordsHashTag}
                                            >
                                                #
                                            </Title>
                                            {keywords}
                                        </Text>
                                    ))}
                            </View>

                        </SafeAreaView>
                    )
                    : null}
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0e0e',
        justifyContent: 'center'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    title: {
        color: '#fff',
        fontSize: 20,
        margin: 10,
        marginBottom: 5,
        textAlign: 'center'
    },
    dateBox: {
        justifyContent: 'center',
        alignContent: 'center'
    },
    date: {
        fontSize: 14,
        color: '#fff'
    },
    description: {
        marginBottom: 0,
        color: '#737373',
        fontSize: 18,
        textAlign: 'center'
    },
    genres: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    genresBox: {
        backgroundColor: '#0093cb',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 5,
        padding: 3
    },
    genresText: {
        color: '#fff',
        fontSize: 14
    },
    body: {
        flexDirection: 'column',
        marginTop: 10
    },
    bodyBox: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 10,
        marginTop: 20
    },
    name: {
        color: '#fff',
        fontSize: 20
    },
    overview: {
        color: '#737373',
        fontSize: 18,
        marginTop: 5
    },
    commentaryBox: {
        margin: 10
    },
    commentaryText: {
        fontSize: 16,
        color: '#737373',
        textAlign: 'center'
    },
    sourcesBox: {
        margin: 10,
        marginBottom: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
    },
    sourcesText: {
        color: '#737373',
        marginRight: 5,
        fontSize: 16
    },
    sourcesSubText: {
        color: '#fff',
        fontSize: 16
    },
    keywordsBox: {
        margin: 5,
        marginTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    keywordsText: {
        color: '#fff',
        fontSize: 16,
        margin: 5
    },
    keywordsHashTag: {
        fontSize: 16,
        color: '#0093cb'
    }
})
