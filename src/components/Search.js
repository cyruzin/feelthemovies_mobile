import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    FlatList,
    TextInput,
    ActivityIndicator,
    TouchableWithoutFeedback
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import { axiosTMDB } from '../config/axios'
import debounce from 'lodash/debounce'
import orderBy from 'lodash/orderBy'
import uniqBy from 'lodash/uniqBy'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Container, List, Message, ScrollTop } from './UI'

export default class Search extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            fetch: false,
            successful: false,
            warning: false,
            scroll: false,
            failure: '',
            payload: [],
            textInput: '',
            currentPage: 1,
            lastPage: 0,
            screenPosition: 0
        }

        this.searchRef = React.createRef()
        this.scrollRef = React.createRef()
        this.searchFetchHandler = debounce(this.searchFetchHandler, 800)
    }

    searchFetchHandler = async () => {
        this.searchCheckHandler()

        try {
            const query = encodeURIComponent(this.state.textInput)
            const res = await axiosTMDB.get(
                `/search/multi?include_adult=false&query=${query}&page=1`
            )

            this.setState({
                payload: res.data.results,
                successful: true,
                lastPage: res.data.total_pages,
                fetch: false
            })

        } catch (e) {
            this.setState({
                failure: 'Something went wrong',
                fetch: false
            })
        }
    }

    loadMoreHandler = async () => {
        const { payload, currentPage } = this.state

        try {
            const query = encodeURIComponent(this.state.textInput)
            const res = await axiosTMDB.get(
                `/search/multi?include_adult=false&query=${query}&page=${currentPage}`
            )

            this.setState({
                payload: uniqBy([
                    ...payload,
                    ...res.data.results
                ], 'id'),
                lastPage: res.data.total_pages,
                scroll: false,
                successful: true,
                fetch: false
            })

        } catch (e) {
            this.setState({
                failure: 'Something went wrong',
                fetch: false,
                scroll: false
            })
        }
    }

    searchCheckHandler = () => {
        if (this.state.textInput === '') {
            this.setState({
                successful: false,
                warning: true
            })
            return false
        }

        this.setState({
            fetch: true,
            successful: false,
            warning: false,
            scroll: false,
            payload: [],
            currentPage: 1,
            lastPage: 0,
            screenPosition: 0,
            failure: ''
        })
    }

    scrollHandler = () => {
        const {
            currentPage, lastPage
        } = this.state

        if (currentPage < lastPage) {
            this.setState({
                currentPage: currentPage + 1,
                scroll: true
            }, () => this.loadMoreHandler()
            )
        }
    }

    scrollTopHandler = () => {
        this.scrollRef.current.scrollToOffset({ x: 0, y: 0, animated: true })
    }

    textInputHandler = textInput => {
        this.setState({ textInput: textInput })
        this.searchFetchHandler()
    }

    clearInputHandler = () => {
        this.searchRef.current.clear()
        this.setState({
            textInput: '',
            successful: false,
            screenPosition: 0
        })
    }

    render() {
        const {
            textInput, fetch, failure, successful,
            payload, warning, screenPosition
        } = this.state

        return (
            <Container style={styles.container}>
                <View style={styles.content}>

                    <TouchableWithoutFeedback onPress={() => Actions.pop()}>
                        <View style={styles.backButton}>
                            <Icon name='arrow-back' size={24} color='#fff' />
                        </View>
                    </TouchableWithoutFeedback>

                    <View style={styles.searchBox}>
                        <TextInput
                            style={styles.textInput}
                            placeholderTextColor='#737373'
                            placeholder='Search for a movie, tv show or person'
                            onChangeText={this.textInputHandler}
                            ref={this.searchRef} />

                        {textInput !== '' ?
                            <TouchableWithoutFeedback
                                onPress={this.clearInputHandler}>
                                <Icon
                                    name='cancel'
                                    size={18}
                                    color='#737373'
                                    style={styles.clearButton} />
                            </TouchableWithoutFeedback>
                            :
                            null
                        }
                    </View>
                </View>

                <View style={styles.activityIndicatorBox}>
                    {fetch ?
                        <ActivityIndicator
                            size='large'
                            color='#737373' />
                        : null
                    }
                </View>

                {successful && payload.length === 0 ?
                    <Message text='No Result' />
                    :
                    null
                }

                {
                    !successful && !warning && failure !== '' ?
                        <Message text={searchFailure} />
                        :
                        null
                }

                {successful ?
                    <View style={styles.searchResultsBox}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps='always'
                            ref={this.scrollRef}
                            onScroll={event => this.setState({
                                screenPosition: event.nativeEvent.contentOffset.y
                            })}
                            onEndReachedThreshold={0.5}
                            onEndReached={this.scrollHandler}
                            keyExtractor={item => item.id.toString()}
                            data={payload}
                            renderItem={({ item }) => {
                                if (
                                    item.media_type === 'movie'
                                    && item.poster_path !== null
                                ) {
                                    return (
                                        <List
                                            route='TitleDetails'
                                            id={item.id}
                                            type={item.media_type}
                                            image={item.poster_path}
                                            badge
                                            badgeText={item.media_type.capitalize()}
                                            title={item.title}
                                            date={item.release_date}
                                            body={item.overview} />
                                    )
                                } else if (
                                    item.media_type === 'tv'
                                    && item.backdrop_path !== null
                                ) {
                                    return (
                                        <List
                                            route='TitleDetails'
                                            id={item.id}
                                            type={item.media_type}
                                            image={item.poster_path}
                                            badge
                                            badgeText={item.media_type.toUpperCase()}
                                            title={item.name}
                                            date={item.first_air_date}
                                            body={item.overview} />
                                    )
                                } else if (
                                    item.media_type === 'person'
                                    && item.profile_path !== null
                                ) {
                                    return (
                                        <List
                                            route='Person'
                                            id={item.id}
                                            type={item.media_type}
                                            image={item.profile_path}
                                            badge
                                            badgeText={item.media_type.capitalize()}
                                            title={item.name}
                                            body={
                                                orderBy(
                                                    item.known_for,
                                                    'vote_count',
                                                    'desc'
                                                )
                                                    .slice(0, 3)
                                                    .map(m => {
                                                        if (
                                                            m.media_type === 'movie'
                                                        ) {
                                                            return m.title
                                                        } else if (
                                                            m.media_type === 'tv'
                                                        ) {
                                                            return m.name
                                                        }
                                                    })
                                                    .join(', ')
                                            } />
                                    )
                                }
                            }}
                        />
                        {screenPosition >= 250 ?
                            <ScrollTop
                                onPress={this.scrollTopHandler}
                            />
                            :
                            null
                        }
                    </View>
                    :
                    null
                }
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start'
    },
    content: {
        backgroundColor: '#0f0e0e',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        elevation: 1,
        shadowColor: '#737373',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.75,
        shadowRadius: 5
    },
    backButton: {
        justifyContent: 'center',
        alignContent: 'center',
        flexGrow: 1
    },
    clearButton: {
        position: 'absolute',
        top: 16,
        right: 10
    },
    searchBox: {
        flexGrow: 4,
        position: 'relative'
    },
    textInput: {
        borderRadius: 5,
        backgroundColor: '#1b1919',
        color: '#fff',
        fontFamily: 'OpenSansCondensed-Light'
    },
    activityIndicatorBox: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -10
    },
    searchResultsBox: {
        flex: 1,
        position: 'relative',
        justifyContent: 'center',
        margin: 10
    }
})