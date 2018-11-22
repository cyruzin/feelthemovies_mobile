import React, { PureComponent } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
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
import { type, routeFix } from '../../util/helpers'
import { imgPath } from '../../config/constants'
import { Container, Badge, Message } from '../UI'

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
            <Container>
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

                <ScrollView showsVerticalScrollIndicator={false}>
                    {searchSuccessful ?
                        <View>
                            <View style={styles.searchResultsBox}>
                                {searchPayload.map(search => {

                                    return (
                                        <TouchableWithoutFeedback
                                            onPress={() =>
                                                routeFix('Recommendation', {
                                                    id: search.id,
                                                    recommendation: search
                                                })}
                                            key={search.id}>
                                            <View style={styles.titleBox}>
                                                <View style={styles.titleImage}>
                                                    <Image
                                                        style={styles.image}
                                                        source={{
                                                            uri: `${imgPath.W185}${search.poster}`
                                                        }}
                                                    />
                                                    <Badge style={styles.titleBadge}>
                                                        <Text style={styles.titleBadgeText}>
                                                            {
                                                                type(search.type)
                                                            }
                                                        </Text>
                                                    </Badge>
                                                </View>

                                                <View style={styles.titleInfo}>
                                                    <Text style={styles.titleInfoText}>
                                                        {search.title}
                                                    </Text>

                                                    <Text style={styles.titleInfoSubText}>
                                                        {moment(search.created_at)
                                                            .format('YYYY')}
                                                    </Text>
                                                </View>

                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
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
