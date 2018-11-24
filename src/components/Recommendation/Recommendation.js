import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    Text,
    ActivityIndicator,
    TouchableWithoutFeedback,
    FlatList
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import axios from '../../config/axios'
import moment from 'moment'
import { imgPath } from '../../config/constants'
import { limitChar, removeHTML, routeFix } from '../../util/helpers'
import { Container, Message } from '../UI'

export default class Recommendation extends PureComponent {
    state = {
        itemsFetch: false,
        itemsSuccessful: false,
        itemsFailure: '',
        itemsPayload: []
    }

    async componentDidMount() {
        try {
            const { id } = this.props
            this.setState({ itemsFetch: true })
            const res = await axios.get(`recommendation_items/${id}`)
            this.setState({
                itemsPayload: res.data.data,
                itemsFetch: false,
                itemsSuccessful: true
            })
        } catch (e) {
            this.setState({
                itemsFailure: 'Something went wrong',
                itemsFetch: false
            })
        }
    }

    render() {
        const { recommendation } = this.props

        const {
            itemsFetch, itemsFailure,
            itemsSuccessful, itemsPayload
        } = this.state

        return (
            <Container>

                {itemsFetch ?
                    <ActivityIndicator
                        size='large'
                        color='#737373' />
                    : null
                }

                {itemsFailure !== '' ?
                    <Message text={itemsFailure} />
                    :
                    null
                }

                {itemsSuccessful ?
                    <ScrollView
                        showsVerticalScrollIndicator={false}>

                        <View style={styles.contentHeader}>
                            <Text style={styles.contentTitle}>
                                {recommendation.title}
                            </Text>
                            <Text style={styles.contentDescription}>
                                {removeHTML(recommendation.body)}
                            </Text>
                        </View>

                        <View style={styles.contentGenres}>
                            {recommendation.genres
                                .slice(0, 4)
                                .map(genres => (
                                    <View
                                        key={genres.id}
                                        style={styles.contentGenresBox}>
                                        <Text style={styles.contentGenresText}>
                                            {genres.name}
                                        </Text>
                                    </View>
                                ))
                            }
                        </View>

                        <View style={styles.contentBody}>

                            <FlatList
                                showsVerticalScrollIndicator={false}
                                keyExtractor={item => item.id.toString()}
                                data={itemsPayload}
                                renderItem={({ item }) => (
                                    <View>
                                        <TouchableWithoutFeedback
                                            onPress={() => routeFix('TitleDetails', {
                                                id: item.tmdb_id,
                                                type: item.media_type
                                            })}
                                        >
                                            <View
                                                style={styles.contentBodyBox}>
                                                <View style={{ width: '30%' }}>
                                                    <Image
                                                        style={styles.image}
                                                        source={{
                                                            uri: `${imgPath.W185}${item.poster}`
                                                        }} />
                                                </View>
                                                <View style={{ width: '70%', marginLeft: 10 }}>
                                                    <Text style={styles.contentName}>
                                                        {item.name}
                                                    </Text>
                                                    <Text style={styles.contentDate}>
                                                        {moment(item.year).format('YYYY')
                                                        }</Text>
                                                    <Text style={styles.contentOverview}>
                                                        {limitChar(item.overview, 200, 170)}
                                                    </Text>
                                                </View>

                                            </View>

                                        </TouchableWithoutFeedback>
                                        {item.commentary !== '' ?
                                            <View style={{
                                                margin: 10
                                            }}>
                                                <Text style={{
                                                    fontSize: 14,
                                                    color: '#737373',
                                                    textAlign: 'center'
                                                }}>
                                                    <Icon name='format-quote' size={14} color='#fff' />
                                                    {removeHTML(item.commentary)}
                                                </Text>
                                            </View>
                                            :
                                            null
                                        }
                                        {item.sources.length > 0 ?
                                            <View style={{
                                                margin: 10,
                                                flexDirection: 'row',
                                                flexWrap: 'wrap',
                                                justifyContent: 'flex-start',
                                            }}>
                                                <Text style={{
                                                    color: '#737373',
                                                    marginRight: 5,
                                                    fontSize: 14
                                                }}>
                                                    Watch On:
                                        </Text>
                                                <Text style={{
                                                    color: '#fff',
                                                    fontSize: 14
                                                }}>
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
                            style={styles.contentKeywordsBox}>
                            {recommendation.keywords
                                .map(keywords => (
                                    <Text
                                        key={keywords.id}
                                        style={styles.contentKeywordsText}>
                                        <Text
                                            style={styles.contentKeywordsHashTag}>
                                            #
                                        </Text>
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
    contentHeader: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    contentTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        margin: 10,
        textAlign: 'center'
    },
    contentDescription: {
        margin: 10,
        marginTop: 0,
        color: '#737373',
        fontSize: 16,
        textAlign: 'center'
    },
    contentGenres: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentGenresBox: {
        backgroundColor: '#0093cb',
        margin: 5,
        padding: 3
    },
    contentGenresText: {
        color: '#fff',
        fontSize: 12
    },
    contentBody: {
        flexDirection: 'column',
        marginTop: 10
    },
    contentBodyBox: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 10,
        marginTop: 20
    },
    contentName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    contentOverview: {
        color: '#737373',
        fontSize: 14,
        marginTop: 5
    },
    contentKeywordsBox: {
        margin: 5,
        marginTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    contentKeywordsText: {
        color: '#fff',
        fontSize: 14,
        margin: 5
    },
    contentKeywordsHashTag: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0093cb'
    },
    contentDate: {
        fontSize: 14,
        color: '#737373',
        marginTop: 3
    },
    image: {
        width: 100,
        height: 150,
        maxHeight: 150,
        borderWidth: 1,
        borderColor: '#fff'
    }
})