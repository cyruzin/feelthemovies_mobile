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
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Container, List, Message } from './UI'

export default class Search extends PureComponent {

    constructor(props) {
        super(props)
        this.searchRef = React.createRef()
        this.searchFetchHandler = debounce(this.searchFetchHandler, 800)
    }

    state = {
        fetch: false,
        successful: false,
        warning: false,
        failure: '',
        payload: [],
        textInput: ''
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
                fetch: false
            })

        } catch (e) {
            this.setState({
                failure: 'Something went wrong',
                fetch: false
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
            failure: ''
        })
    }

    textInputHandler = textInput => {
        this.setState({ textInput: textInput })
        this.searchFetchHandler()
    }

    clearInputHandler = () => {
        this.searchRef.current.clear()
        this.setState({
            textInput: '',
            successful: false
        })
    }

    render() {
        const {
            textInput, fetch, failure, successful, payload, warning
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
    }
})