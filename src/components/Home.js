import React, { PureComponent } from 'react'
import {
    StyleSheet,
    Image,
    View,
    ActivityIndicator,
    TouchableHighlight,
    RefreshControl,
    FlatList
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconFeather from 'react-native-vector-icons/Feather'
import moment from 'moment'
import axios from '../config/axios'
import { imgPath } from '../config/constants'
import { removeHTML, routeFix, type } from '../util/helpers'
import { Container, Message, Title, Text } from './UI'

export default class Home extends PureComponent {

    state = {
        recommendationFetch: false,
        recommendationSuccess: false,
        recommendationRefreshing: false,
        recommendationScroll: false,
        recommendationError: '',
        recommendationPayload: [],
        recommendationCurrentPage: 1,
        recommendationLastPage: 0
    }

    componentDidMount() {
        this.fetchRecommendations()
    }

    fetchRecommendations = async () => {
        const {
            recommendationPayload,
            recommendationCurrentPage,
            recommendationScroll,
            recommendationRefreshing
        } = this.state

        if (!recommendationScroll) {
            this.setState({ recommendationFetch: true })
        }

        try {
            const res = await axios.get(`/recommendations?page=${recommendationCurrentPage}`)

            this.setState({
                recommendationPayload: [
                    ...recommendationPayload,
                    ...res.data.data
                ],
                recommendationLastPage: res.data.last_page,
                recommendationSuccess: true,
                recommendationRefreshing: false,
                recommendationScroll: false,
                recommendationFetch: false,
            })

        } catch (e) {
            this.setState({
                recommendationError: 'Something went wrong',
                recommendationFetch: false,
                recommendationRefreshing: false,
                recommendationScroll: false
            })
        }
    }

    refreshHandler = () => {
        this.setState({
            recommendationRefreshing: true,
            recommendationSuccess: false,
            recommendationPayload: [],
            recommendationCurrentPage: 1,
            recommendationError: ''
        }, () =>
                this.fetchRecommendations()
        )
    }

    scrollHandler = () => {
        const {
            recommendationCurrentPage,
            recommendationLastPage
        } = this.state

        if (recommendationCurrentPage < recommendationLastPage) {
            this.setState({
                recommendationCurrentPage: recommendationCurrentPage + 1,
                recommendationScroll: true
            }, () => this.fetchRecommendations()
            )
        }
    }

    typeHandler = titleType => {
        var titleType = parseInt(titleType)
        if (titleType === 0) {
            return (
                <Text style={styles.contentFootBody}>
                    <Icon name='movie-roll'
                        size={12} color='#737373' /> {type(
                            titleType
                        )}
                </Text>
            )
        } else if (titleType === 1) {
            return (
                <Text style={styles.contentFootBody}>
                    <IconFeather name='tv'
                        size={11} color='#737373' /> {type(
                            titleType
                        )}
                </Text>
            )
        } else if (titleType === 2) {
            return (
                <Text style={styles.contentFootBody}>
                    <Icon name='mixer'
                        size={11} color='#737373' /> {type(
                            titleType
                        )}
                </Text>
            )
        }
    }

    render() {

        const {
            recommendationFetch, recommendationSuccess,
            recommendationPayload, recommendationError,
            recommendationRefreshing
        } = this.state

        return (
            <Container>
                {recommendationFetch ?
                    <ActivityIndicator
                        size='large'
                        color='#737373' />
                    : null
                }

                {recommendationError !== '' ?
                    <Message text={recommendationError} />
                    :
                    null
                }

                {recommendationSuccess ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                progressBackgroundColor='#0f0e0e'
                                colors={['#0093cb', '#737373']}
                                refreshing={recommendationRefreshing}
                                onRefresh={this.refreshHandler}
                            />
                        }
                        onEndReachedThreshold={0.5}
                        onEndReached={this.scrollHandler}
                        data={recommendationPayload}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <View>
                                <TouchableHighlight
                                    onPress={() => routeFix('Recommendation', {
                                        id: item.id,
                                        recommendation: item
                                    })}>
                                    <View>
                                        <Image
                                            style={styles.contentImage}
                                            source={{
                                                uri: `${imgPath.W500}${item.backdrop}`
                                            }} />
                                    </View>
                                </TouchableHighlight>
                                <View style={styles.contentDate}>
                                    <Text style={styles.contentDateText}>
                                        {moment(item.created_at).format('D MMM')}
                                    </Text>
                                </View>
                                <View style={{ position: 'relative' }}>
                                    <View style={styles.contentGenres}>
                                        <Text style={styles.contentGenresText}>
                                            {item.genres
                                                .slice(0, 4)
                                                .map(g => g.name)
                                                .join(', ')}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableHighlight
                                    onPress={() => routeFix('Recommendation', {
                                        id: item.id,
                                        recommendation: item
                                    })}>
                                    <View style={styles.content}>

                                        <Title style={styles.contentTitle}>
                                            {item.title}
                                        </Title>
                                        <Text style={styles.contentBody}>
                                            {removeHTML(item.body)}
                                        </Text>
                                    </View>
                                </TouchableHighlight>
                                <View style={styles.contentFoot}>
                                    <Text style={styles.contentFootBody}>
                                        <Icon name='clock-outline'
                                            size={12} color='#737373' /> {
                                            moment(item.created_at).fromNow()
                                        }
                                    </Text>
                                    {this.typeHandler(
                                        item.type
                                    )}
                                </View>
                            </View>
                        )

                        }
                    />
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
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: '#0f0e0e',
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        marginBottom: 10
    },
    contentImage: {
        width: null,
        height: 200,
        maxHeight: 200
    },
    contentDate: {
        position: 'absolute',
        top: 20,
        right: 0,
        backgroundColor: '#0093cb',
    },
    contentDateText: {
        color: '#fff',
        padding: 5,
        fontSize: 12,
    },
    contentGenres: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: '#0093cb',
        maxWidth: 260,
        padding: 5
    },
    contentGenresText: {
        color: '#fff',
        fontSize: 12,
    },
    contentTitle: {
        fontSize: 18,
        textAlign: 'center',
        color: '#fff'
    },
    contentBody: {
        fontSize: 16,
        textAlign: 'justify',
        marginTop: 10,
        color: '#737373'
    },
    contentFoot: {
        margin: 20,
        flexDirection: 'row'
    },
    contentFootBody: {
        color: '#737373',
        fontSize: 12,
        padding: 5
    }
})