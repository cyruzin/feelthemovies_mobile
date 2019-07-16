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
import axios from '../../config/axios'
import { imgPath } from '../../config/constants'
import { routeFix, type } from '../../util/helpers'
import {
    Container, Message, Title, Text, ScrollTop
} from '../UI'

export default class Home extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            fetch: false,
            success: false,
            refreshing: false,
            scroll: false,
            error: '',
            payload: [],
            currentPage: 1,
            lastPage: 0,
            screenPosition: 0
        }

        this.scrollRef = React.createRef()
    }

    componentDidMount() {
        this.fetchRecommendations()
    }

    fetchRecommendations = async () => {
        const {
            payload, currentPage, scroll
        } = this.state

        if (!scroll) {
            this.setState({ fetch: true })
        }

        try {
            const res = await axios.get(`/recommendations?page=${currentPage}`)

            this.setState({
                payload: [
                    ...payload,
                    ...res.data.data
                ],
                lastPage: res.data.last_page,
                success: true,
                refreshing: false,
                scroll: false,
                fetch: false,
            })
        } catch (e) {
            this.setState({
                error: 'Looks like Thanos snapped his fingers!',
                fetch: false,
                refreshing: false,
                scroll: false
            })
        }
    }

    refreshHandler = () => {
        this.setState({
            refreshing: true,
            success: false,
            payload: [],
            currentPage: 1,
            error: ''
        }, () => this.fetchRecommendations())
    }

    scrollHandler = () => {
        const {
            currentPage, lastPage
        } = this.state

        if (currentPage < lastPage) {
            this.setState({
                currentPage: currentPage + 1,
                scroll: true
            }, () => this.fetchRecommendations())
        }
    }

    scrollTopHandler = () => {
        this.scrollRef.current.scrollToOffset({ x: 0, y: 0, animated: true })
    }

    typeHandler = (titleType) => {
        var titleType = parseInt(titleType)
        if (titleType === 0) {
            return (
                <Text style={styles.contentFootBody}>
                    <Icon
                      name="movie-roll"
                      size={13}
                      color="#737373"
                    />
                    {' '}
                    {type(
                        titleType
                    )}
                </Text>
            )
        } if (titleType === 1) {
            return (
                <Text style={styles.contentFootBody}>
                    <IconFeather
                      name="tv"
                      size={11}
                      color="#737373"
                    />
                    {' '}
                    {type(
                        titleType
                    )}
                </Text>
            )
        } if (titleType === 2) {
            return (
                <Text style={styles.contentFootBody}>
                    <Icon
                      name="mixer"
                      size={11}
                      color="#737373"
                    />
                    {' '}
                    {type(
                        titleType
                    )}
                </Text>
            )
        }
    }

    render() {
        const {
            fetch, success, payload, error, refreshing, screenPosition
        } = this.state

        return (
            <Container>
                {fetch
                    ? (
                        <ActivityIndicator
                          size="large"
                          color="#737373"
                        />
                    )
                    : null
                }

                {error !== ''
                    ? <Message text={error} />
                    : null
                }

                {success
                    ? (
                        <FlatList
                          showsVerticalScrollIndicator={false}
                          ref={this.scrollRef}
                          onScroll={event => this.setState({
                                screenPosition: event.nativeEvent.contentOffset.y
                            })}
                          refreshControl={(
                                <RefreshControl
                                  progressBackgroundColor="#0f0e0e"
                                  colors={['#0093cb', '#737373']}
                                  refreshing={refreshing}
                                  onRefresh={this.refreshHandler}
                                />
                            )}
                          onEndReachedThreshold={0.5}
                          onEndReached={this.scrollHandler}
                          data={payload}
                          keyExtractor={item => item.id.toString()}
                          renderItem={({ item }) => (
                                <View>
                                    <TouchableHighlight
                                      onPress={() => routeFix('Recommendation', {
                                            id: item.id,
                                            recommendation: item
                                        })}
                                    >
                                        <View>
                                            <Image
                                              style={styles.contentImage}
                                              source={{
                                                    uri: `${imgPath.W500}${item.backdrop}`
                                                }}
                                            />
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
                                        })}
                                    >
                                        <View style={styles.content}>

                                            <Title style={styles.contentTitle}>
                                                {item.title}
                                            </Title>
                                            <Text style={styles.contentBody}>
                                                {item.body}
                                            </Text>
                                        </View>
                                    </TouchableHighlight>
                                    <View style={styles.contentFoot}>
                                        <Text style={styles.contentFootBody}>
                                            <Icon
                                              name="clock-outline"
                                              size={12}
                                              color="#737373"
                                            />
                                            {' '}
                                            {
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
                    )
                    : null
                }
                {screenPosition >= 250
                    ? (
                        <ScrollTop
                          onPress={this.scrollTopHandler}
                        />
                    )
                    : null
                }
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        marginBottom: 10
    },
    contentImage: {
        width: null,
        height: 200,
        resizeMode: 'cover'
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
        fontSize: 14
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
        fontSize: 14,
    },
    contentTitle: {
        fontSize: 20,
        textAlign: 'center',
        color: '#fff'
    },
    contentBody: {
        fontSize: 18,
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
        fontSize: 14,
        padding: 5
    }
})
