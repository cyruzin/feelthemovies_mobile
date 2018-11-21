import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TextInput,
    ActivityIndicator,
    TouchableWithoutFeedback
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import { axiosTMDB } from '../config/axios'
import debounce from 'lodash/debounce'
import orderBy from 'lodash/orderBy'
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { routeFix } from '../util/helpers'
import { imgPath } from '../config/constants'
import { Container, Badge, Message } from './UI'

export default class Search extends Component {

    constructor(props) {
        super(props)
        this.searchRef = React.createRef()
        this.searchFetchHandler = debounce(this.searchFetchHandler, 800)
    }

    state = {
        searchFetch: false,
        searchSuccessful: false,
        searchFailure: '',
        searchPayload: [],
        searchTextInput: ''
    }

    searchFetchHandler = async () => {
        try {
            this.setState({ searchFetch: true })

            const query = encodeURIComponent(this.state.searchTextInput)
            const res = await axiosTMDB.get(
                `/search/multi?include_adult=false&query=${query}&page=1`
            )

            this.setState({
                searchPayload: res.data.results,
                searchSuccessful: true,
                searchFetch: false
            })

        } catch (e) {
            this.setState({
                searchFailure: 'Something went wrong',
                searchFetch: false
            })
        }
    }

    textInputHandler = textInput => {
        this.setState({ searchTextInput: textInput })
        this.searchFetchHandler()
    }

    clearInputHandler = () => {
        this.searchRef.current.clear()
        this.setState({
            searchTextInput: '',
            searchSuccessful: false
        })
    }

    render() {
        const {
            searchTextInput, searchFetch,
            searchFailure, searchSuccessful,
            searchPayload
        } = this.state

        return (
            <Container>
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

                        {searchTextInput !== '' ?
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
                    {searchFetch ?
                        <ActivityIndicator
                            size='large'
                            color='#737373' />
                        : null
                    }
                </View>

                {searchSuccessful && searchPayload.length === 0 ?
                    <Message text='No Result' />
                    :
                    null
                }

                {searchFailure !== '' ?
                    <Message text={searchFailure} />
                    :
                    null
                }

                <ScrollView showsVerticalScrollIndicator={false}>
                    {searchSuccessful ?
                        <View>
                            <View style={styles.searchResultsBox}>
                                {searchPayload.map(search => {
                                    if (
                                        search.media_type === 'movie'
                                        && search.poster_path !== null
                                    ) {
                                        return (
                                            <TouchableWithoutFeedback
                                                onPress={() =>
                                                    routeFix('TitleDetails', {
                                                        id: search.id,
                                                        type: search.media_type
                                                    })}
                                                key={search.id}>
                                                <View style={styles.titleBox}>
                                                    <View style={styles.titleImage}>
                                                        <Image
                                                            style={styles.image}
                                                            source={{
                                                                uri: `${imgPath.W185}${search.poster_path}`
                                                            }}
                                                        />
                                                        <Badge style={styles.titleBadge}>
                                                            <Text style={styles.titleBadgeText}>
                                                                {search.media_type.capitalize()}
                                                            </Text>
                                                        </Badge>
                                                    </View>

                                                    <View style={styles.titleInfo}>
                                                        <Text style={styles.titleInfoText}>
                                                            {search.title}
                                                        </Text>

                                                        <Text style={styles.titleInfoSubText}>
                                                            {moment(search.release_date)
                                                                .format('YYYY')}
                                                        </Text>
                                                    </View>

                                                </View>
                                            </TouchableWithoutFeedback>
                                        )
                                    } else if (
                                        search.media_type === 'tv'
                                        && search.backdrop_path !== null
                                    ) {
                                        return (
                                            <TouchableWithoutFeedback
                                                onPress={() => routeFix('TitleDetails', {
                                                    id: search.id,
                                                    type: search.media_type
                                                })}
                                                key={search.id}>
                                                <View style={styles.titleBox}>
                                                    <View style={styles.titleImage}>
                                                        <Image
                                                            style={styles.image}
                                                            source={{
                                                                uri: `${imgPath.W185}${search.poster_path}`
                                                            }}
                                                        />
                                                        <Badge style={styles.titleBadge}>
                                                            <Text style={styles.titleBadgeText}>
                                                                {search.media_type.toUpperCase()}
                                                            </Text>
                                                        </Badge>
                                                    </View>

                                                    <View style={styles.titleInfo}>
                                                        <Text style={styles.titleInfoText}>
                                                            {search.name}
                                                        </Text>

                                                        <Text style={styles.titleInfoSubText}>
                                                            {moment(search.first_air_date)
                                                                .format('YYYY')}
                                                        </Text>
                                                    </View>

                                                </View>
                                            </TouchableWithoutFeedback>
                                        )
                                    } else if (
                                        search.media_type === 'person'
                                        && search.profile_path !== null
                                    ) {
                                        return (
                                            <TouchableWithoutFeedback
                                                onPress={() => routeFix('Person', {
                                                    id: search.id
                                                })}
                                                key={search.id}>
                                                <View style={styles.titleBox}>
                                                    <View style={styles.titleImage}>
                                                        <Image
                                                            style={styles.image}
                                                            source={{
                                                                uri: `${imgPath.W185}${search.profile_path}`
                                                            }}
                                                        />
                                                        <Badge style={styles.titleBadge}>
                                                            <Text style={styles.titleBadgeText}>
                                                                {search.media_type.capitalize()}
                                                            </Text>
                                                        </Badge>
                                                    </View>

                                                    <View style={styles.titleInfo}>
                                                        <Text style={styles.titleInfoText}>
                                                            {search.name}
                                                        </Text>

                                                        <Text style={styles.titleInfoSubText}>
                                                            {
                                                                orderBy(
                                                                    search.known_for,
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
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        )
                                    }
                                }
                                )
                                }
                            </View>
                        </View>
                        :
                        null
                    }
                </ScrollView>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
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
        color: '#fff'
    },
    activityIndicatorBox: {
        position: 'absolute',
        top: '50%',
        left: '45%',
        margin: 0
    },
    searchResultsBox: {
        flex: 1,
        justifyContent: 'center',
        margin: 10
    },
    titleBox: {
        flexDirection: 'row',
        margin: 10
    },
    titleImage: {
        position: 'relative',
        width: '20%'
    },
    image: {
        width: 60,
        height: 80,
        borderWidth: 1,
        borderColor: '#fff',
        resizeMode: 'contain'
    },
    titleBadge: {
        position: 'absolute',
        bottom: 0,
        left: 0
    },
    titleBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold'
    },
    titleInfo: {
        width: '80%',
        margin: 5
    },
    titleInfoText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold'
    },
    titleInfoSubText: {
        color: '#737373',
        fontSize: 14,
    }
})