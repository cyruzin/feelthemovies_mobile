import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    ScrollView,
    ActivityIndicator,
    FlatList
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import axios from '../../config/axios'
import { limitChar } from '../../util/helpers'
import { Container, Message, Title, Text, List } from '../UI'

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
                failure: 'Something went wrong',
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

                {fetch ?
                    <ActivityIndicator
                        size='large'
                        color='#737373' />
                    : null
                }

                {failure !== '' ?
                    <Message text={failure} />
                    :
                    null
                }

                {successful ?
                    <ScrollView
                        showsVerticalScrollIndicator={false}>

                        <View style={styles.header}>
                            <Title style={styles.title}>
                                {recommendation.title}
                            </Title>
                            <Text style={styles.description}>
                                {recommendation.body}
                            </Text>
                        </View>

                        <View style={styles.genres}>
                            {recommendation.genres
                                .slice(0, 4)
                                .map(genres => (
                                    <View
                                        key={genres.id}
                                        style={styles.genresBox}>
                                        <Text style={styles.genresText}>
                                            {genres.name}
                                        </Text>
                                    </View>
                                ))
                            }
                        </View>

                        <View style={styles.body}>

                            <FlatList
                                showsVerticalScrollIndicator={false}
                                keyExtractor={item => item.id.toString()}
                                data={payload}
                                renderItem={({ item }) => (
                                    <View>
                                        <List
                                            route='TitleDetails'
                                            id={item.tmdb_id}
                                            type={item.media_type}
                                            recommendation={item}
                                            image={item.poster}
                                            title={item.name}
                                            date={item.year}
                                            body={limitChar(item.overview, 200, 170)}
                                        />

                                        {item.commentary !== '' ?
                                            <View style={styles.commentaryBox}>
                                                <Text style={styles.commentaryText}>
                                                    <Icon name='format-quote' size={14} color='#fff' />
                                                    {item.commentary}
                                                </Text>
                                            </View>
                                            :
                                            null
                                        }

                                        {item.sources.length > 0 ?
                                            <View style={styles.sourcesBox}>
                                                <Text style={styles.sourcesText}>
                                                    Watch On:
                                                </Text>
                                                <Text style={styles.sourcesSubText}>
                                                    {item.sources.map(s => s.name).join(', ')}
                                                </Text>
                                            </View>
                                            :
                                            null
                                        }

                                    </View>
                                )}
                            />
                        </View>

                        <View
                            style={styles.keywordsBox}>
                            {recommendation.keywords
                                .map(keywords => (
                                    <Text
                                        key={keywords.id}
                                        style={styles.keywordsText}>
                                        <Title
                                            style={styles.keywordsHashTag}>
                                            #
                                        </Title>
                                        {keywords.name}
                                    </Text>
                                ))
                            }
                        </View>

                    </ScrollView>
                    :
                    null
                }
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
        textAlign: 'center'
    },
    description: {
        margin: 10,
        marginTop: 0,
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
        margin: 5,
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