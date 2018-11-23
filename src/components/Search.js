import React, { PureComponent } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
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
import { SearchContainer, Badge, Message } from './UI'

export default class Search extends PureComponent {

    constructor(props) {
        super(props)
        this.searchRef = React.createRef()
        this.searchFetchHandler = debounce(this.searchFetchHandler, 800)
    }

    state = {
        searchFetch: false,
        searchSuccessful: false,
        searchWarning: false,
        searchFailure: '',
        searchPayload: [],
        searchTextInput: ''
    }

    searchFetchHandler = async () => {
        this.searchCheckHandler()

        try {
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

    searchCheckHandler = () => {
        if (this.state.searchTextInput === '') {
            this.setState({
                searchSuccessful: false,
                searchWarning: true
            })
            return false
        }

        this.setState({
            searchFetch: true,
            searchSuccessful: false,
            searchWarning: false,
            searchFailure: ''
        })
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
            searchPayload, searchWarning
        } = this.state

        return (
            <SearchContainer>
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
                                hitSlop={styles.clearHitSlop}
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

                {
                    !searchSuccessful &&
                        !searchWarning &&
                        searchFailure !== '' ?
                        <Message text={searchFailure} />
                        :
                        null
                }

                {searchSuccessful ?
                    <View style={styles.searchResultsBox}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            keyExtractor={item => item.id.toString()}
                            data={searchPayload}
                            renderItem={({ item }) => {
                                if (
                                    item.media_type === 'movie'
                                    && item.poster_path !== null
                                ) {
                                    return (
                                        <TouchableWithoutFeedback
                                            hitSlop={styles.titleHitSlop}
                                            onPress={() =>
                                                routeFix('TitleDetails', {
                                                    id: item.id,
                                                    type: item.media_type
                                                })}>
                                            <View style={styles.titleBox}>
                                                <View style={styles.titleImage}>
                                                    <Image
                                                        style={styles.image}
                                                        source={{
                                                            uri: `${imgPath.W185}${item.poster_path}`
                                                        }}
                                                    />
                                                    <Badge style={styles.titleBadge}>
                                                        <Text style={styles.titleBadgeText}>
                                                            {item.media_type.capitalize()}
                                                        </Text>
                                                    </Badge>
                                                </View>

                                                <View style={styles.titleInfo}>
                                                    <Text style={styles.titleInfoText}>
                                                        {item.title}
                                                    </Text>

                                                    <Text style={styles.titleInfoSubText}>
                                                        {moment(item.release_date)
                                                            .format('YYYY')}
                                                    </Text>
                                                </View>

                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                } else if (
                                    item.media_type === 'tv'
                                    && item.backdrop_path !== null
                                ) {
                                    return (
                                        <TouchableWithoutFeedback
                                            hitSlop={styles.titleHitSlop}
                                            onPress={() => routeFix('TitleDetails', {
                                                id: item.id,
                                                type: item.media_type
                                            })}>
                                            <View style={styles.titleBox}>
                                                <View style={styles.titleImage}>
                                                    <Image
                                                        style={styles.image}
                                                        source={{
                                                            uri: `${imgPath.W185}${item.poster_path}`
                                                        }}
                                                    />
                                                    <Badge style={styles.titleBadge}>
                                                        <Text style={styles.titleBadgeText}>
                                                            {item.media_type.toUpperCase()}
                                                        </Text>
                                                    </Badge>
                                                </View>

                                                <View style={styles.titleInfo}>
                                                    <Text style={styles.titleInfoText}>
                                                        {item.name}
                                                    </Text>

                                                    <Text style={styles.titleInfoSubText}>
                                                        {moment(item.first_air_date)
                                                            .format('YYYY')}
                                                    </Text>
                                                </View>

                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                } else if (
                                    item.media_type === 'person'
                                    && item.profile_path !== null
                                ) {
                                    return (
                                        <TouchableWithoutFeedback
                                            hitSlop={styles.titleHitSlop}
                                            onPress={() => routeFix('Person', {
                                                id: item.id
                                            })}>
                                            <View style={styles.titleBox}>
                                                <View style={styles.titleImage}>
                                                    <Image
                                                        style={styles.image}
                                                        source={{
                                                            uri: `${imgPath.W185}${item.profile_path}`
                                                        }}
                                                    />
                                                    <Badge style={styles.titleBadge}>
                                                        <Text style={styles.titleBadgeText}>
                                                            {item.media_type.capitalize()}
                                                        </Text>
                                                    </Badge>
                                                </View>

                                                <View style={styles.titleInfo}>
                                                    <Text style={styles.titleInfoText}>
                                                        {item.name}
                                                    </Text>

                                                    <Text style={styles.titleInfoSubText}>
                                                        {
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
                                                        }
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                }
                            }}
                        />
                    </View>
                    :
                    null
                }

            </SearchContainer>
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
        left: '50%',
        marginLeft: -10
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
    },
    clearHitSlop: {
        top: 10,
        left: 10,
        bottom: 10,
        right: 10
    },
    titleHitSlop: {
        top: 10,
        left: 10,
        bottom: 10,
        right: 10
    }
})