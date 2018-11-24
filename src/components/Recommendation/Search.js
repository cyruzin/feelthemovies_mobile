import React, { PureComponent } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TextInput,
    Picker,
    ActivityIndicator,
    TouchableWithoutFeedback
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import axios from '../../config/axios'
import debounce from 'lodash/debounce'
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialIcons'
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons'
import { type, routeFix, limitChar, removeHTML } from '../../util/helpers'
import { imgPath } from '../../config/constants'
import { SearchContainer, Badge, Message } from '../UI'

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
        searchType: '',
        searchTextInput: ''
    }

    searchFetchHandler = async () => {
        this.searchCheckHandler()

        try {
            const res = await axios.get(
                '/search_recommendation',
                { params: this.queryHandler() }
            )

            this.setState({
                searchPayload: res.data,
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

    typeHandler = value => {
        this.setState({ searchType: value })
        if (this.state.searchTextInput !== '') {
            this.searchFetchHandler()
        }
    }

    queryHandler = () => {
        const { searchType, searchTextInput } = this.state
        let searchQuery = null
        const query = searchTextInput.replace(/\s+$/, "")

        if (searchType !== '') {
            searchQuery = {
                q: query,
                type: searchType
            }
            return searchQuery
        }

        searchQuery = {
            q: query
        }

        return searchQuery
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
                        <View>
                            <TextInput
                                style={styles.textInput}
                                placeholderTextColor='#737373'
                                placeholder='Search for a keyword or genre'
                                onChangeText={this.textInputHandler}
                                ref={this.searchRef} />
                        </View>
                        <View style={styles.pickerBox}>
                            <Picker
                                mode='dropdown'
                                style={styles.picker}
                                itemStyle={styles.pickerItem}
                                selectedValue={this.state.searchType}
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
                        </View>

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
                            keyboardShouldPersistTaps='always'
                            keyExtractor={item => item.id.toString()}
                            data={searchPayload}
                            renderItem={({ item }) => {
                                return (
                                    <View style={styles.titleBox}>
                                        <TouchableWithoutFeedback
                                            hitSlop={styles.titleHitSlop}
                                            onPress={() =>
                                                routeFix('Recommendation', {
                                                    id: item.id,
                                                    recommendation: item
                                                })}>
                                            <View style={styles.titleImage}>
                                                <Image
                                                    style={styles.image}
                                                    source={{
                                                        uri: `${imgPath.W185}${item.poster}`
                                                    }}
                                                />
                                                <Badge style={styles.titleBadge}>
                                                    <Text style={styles.titleBadgeText}>
                                                        {
                                                            type(item.type)
                                                        }
                                                    </Text>
                                                </Badge>
                                            </View>
                                        </TouchableWithoutFeedback>

                                        <TouchableWithoutFeedback
                                            hitSlop={styles.titleHitSlop}
                                            onPress={() =>
                                                routeFix('Recommendation', {
                                                    id: item.id,
                                                    recommendation: item
                                                })}>
                                            <View style={styles.titleInfo}>
                                                <Text style={styles.titleInfoText}>
                                                    {item.title}
                                                </Text>

                                                <Text style={styles.titleInfoSubText}>
                                                    {moment(item.created_at)
                                                        .format('YYYY')}
                                                </Text>

                                                <Text style={styles.titleInfoSubText}>
                                                    {limitChar(
                                                        removeHTML(
                                                            item.body
                                                        ),
                                                        200,
                                                        170
                                                    )}
                                                </Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                )
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
        fontSize: 16,
        borderRadius: 5,
        backgroundColor: '#1b1919',
        color: '#fff'
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
    },
    titleBox: {
        flexDirection: 'row',
        margin: 10
    },
    titleImage: {
        position: 'relative',
        width: '30%'
    },
    image: {
        width: 100,
        height: 150,
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
        width: '70%',
        margin: 5,
        marginLeft: 10
    },
    titleInfoText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold'
    },
    titleInfoSubText: {
        color: '#737373',
        fontSize: 14,
        marginTop: 3
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
