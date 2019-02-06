import React, { PureComponent } from 'react'
import {
    View,
    StyleSheet,
    FlatList,
    TextInput,
    Picker,
    ActivityIndicator,
    TouchableWithoutFeedback
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import axios from '../../config/axios'
import debounce from 'lodash/debounce'
import Icon from 'react-native-vector-icons/MaterialIcons'
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons'
import { type, limitChar, removeHTML } from '../../util/helpers'
import { Container, Message, List, ScrollTop } from '../UI'

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
            type: '',
            textInput: '',
            currentPage: 1,
            lastPage: 0,
            screenPosition: 0
        }

        this.scrollRef = React.createRef()
        this.searchRef = React.createRef()
        this.searchFetchHandler = debounce(this.searchFetchHandler, 800)
    }

    searchFetchHandler = async () => {
        this.searchCheckHandler()

        try {
            const res = await axios.get(
                '/search_recommendation?page=1',
                { params: this.queryHandler() }
            )

            this.setState({
                payload: res.data.data,
                successful: true,
                lastPage: res.data.last_page,
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
            const res = await axios.get(
                `/search_recommendation?page=${currentPage}`,
                { params: this.queryHandler() }
            )

            this.setState({
                payload: [
                    ...payload,
                    ...res.data.data
                ],
                lastPage: res.data.last_page,
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

    typeHandler = value => {
        this.setState({ type: value })
        if (this.state.textInput !== '') {
            this.searchFetchHandler()
        }
    }

    queryHandler = () => {
        const { type, textInput } = this.state
        let searchQuery = null
        const query = textInput.replace(/\s+$/, "")

        if (type !== '') {
            searchQuery = {
                q: query,
                type: type
            }
            return searchQuery
        }

        searchQuery = {
            query: query
        }

        return searchQuery
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
                        <View>
                            <TextInput
                                style={styles.textInput}
                                autoFocus
                                placeholderTextColor='#737373'
                                placeholder='Search for a keyword or genre'
                                onChangeText={this.textInputHandler}
                                ref={this.searchRef} />
                        </View>
                        {/* <View style={styles.pickerBox}>
                            <Picker
                                mode='dropdown'
                                style={styles.picker}
                                itemStyle={styles.pickerItem}
                                selectedValue={this.state.type}
                                onValueChange={this.typeHandler}
                            >
                                <Picker.Item label="All" value="" />
                                <Picker.Item label="Movie" value="0" />
                                <Picker.Item label="TV" value="1" />
                                <Picker.Item label="Mixed" value="2" />
                            </Picker>
                            <View style={styles.pickerIcon}>
                                <IconMC name='chevron-down' size={24} color='#737373' />
                            </View>
                        </View> */}

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
                        <Message text={failure} />
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
                            renderItem={({ item }) => (
                                <List
                                    route='Recommendation'
                                    id={item.id}
                                    recommendation={item}
                                    image={item.poster}
                                    badge
                                    badgeText={type(item.type)}
                                    title={item.title}
                                    date={item.created_at}
                                    body={
                                        limitChar(
                                            removeHTML(
                                                item.body
                                            ),
                                            200,
                                            170
                                        )
                                    }
                                />
                            )
                            }
                        />
                    </View>
                    :
                    null
                }
                {screenPosition >= 250 ?
                    <ScrollTop
                        onPress={this.scrollTopHandler}
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
        fontSize: 16,
        borderRadius: 5,
        backgroundColor: '#1b1919',
        color: '#fff',
        fontFamily: 'OpenSansCondensed-Light'
    },
    pickerBox: {
        position: 'relative',
        marginTop: 10,
        borderRadius: 5,
        overflow: 'hidden'
    },
    picker: {
        backgroundColor: '#1b1919',
        color: '#737373'
    },
    pickerItem: {
        backgroundColor: '#1b1919',
        color: '#737373'
    },
    pickerIcon: {
        position: 'absolute',
        top: 15,
        right: 15
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
