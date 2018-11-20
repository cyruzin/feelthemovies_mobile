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
import { Container, Badge } from './UI'

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
            const res = await axiosTMDB.get(`/search/multi?include_adult=false&query=${query}&page=1`)
            this.setState({
                searchPayload: res.data.results,
                searchSuccessful: true,
                searchFetch: false
            })
            console.log(res.data.results)
        } catch (e) {
            this.setState({
                searchFailure: e,
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
                <View style={{
                    backgroundColor: '#0f0e0e',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    padding: 10
                }}>
                    <TouchableWithoutFeedback
                        onPress={() => Actions.pop()}>
                        <View style={{
                            justifyContent: 'center',
                            alignContent: 'center',
                            flexGrow: 1
                        }}>
                            <Icon name='arrow-back' size={24} color='#fff' />
                        </View>
                    </TouchableWithoutFeedback>

                    <View style={{
                        flexGrow: 4,
                        position: 'relative'
                    }}>
                        <TextInput
                            style={{
                                borderRadius: 5,
                                backgroundColor: '#1b1919',
                                color: '#fff'
                            }}
                            placeholderTextColor='#737373'
                            placeholder='Search for a movie, tv show, person...'
                            onChangeText={this.textInputHandler}
                            ref={this.searchRef}
                            autoFocus />

                        {searchTextInput !== '' ?
                            <TouchableWithoutFeedback
                                onPress={this.clearInputHandler}>
                                <Icon name='cancel' size={18} color='#737373' style={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 10
                                }} />
                            </TouchableWithoutFeedback>
                            :
                            null
                        }

                    </View>
                </View>

                <View style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    margin: 0
                }}>
                    {searchFetch ?
                        <ActivityIndicator
                            size='large'
                            color='#737373' />
                        : null
                    }
                </View>

                {searchFailure !== '' ? <Text>{searchFailure}</Text> : null}

                <ScrollView showsVerticalScrollIndicator={false}>
                    {searchSuccessful ?
                        <View>
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                margin: 10
                            }}>
                                {searchPayload.map(search => {
                                    if (
                                        search.media_type === 'movie'
                                        && search.poster_path !== null
                                    ) {
                                        return (
                                            <TouchableWithoutFeedback
                                                onPress={() => routeFix('TitleDetails', {
                                                    id: search.id,
                                                    type: search.media_type
                                                })}
                                                key={search.id}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    margin: 10
                                                }}>
                                                    <View style={{
                                                        position: 'relative',
                                                        width: '20%'
                                                    }}>
                                                        <Image
                                                            style={{
                                                                width: 60,
                                                                height: 80,
                                                                borderWidth: 1,
                                                                borderColor: '#fff',
                                                                resizeMode: 'contain'
                                                            }}
                                                            source={{
                                                                uri: `${imgPath.W185}${search.poster_path}`
                                                            }}
                                                        />
                                                        <Badge style={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            left: 0
                                                        }}>
                                                            <Text style={{
                                                                color: '#fff',
                                                                fontSize: 10,
                                                                fontWeight: 'bold'
                                                            }}>
                                                                {search.media_type.capitalize()}
                                                            </Text>
                                                        </Badge>
                                                    </View>

                                                    <View style={{
                                                        width: '80%',
                                                        margin: 5
                                                    }}>
                                                        <Text style={{
                                                            fontSize: 14,
                                                            color: '#fff',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {search.title}
                                                        </Text>

                                                        <Text style={{
                                                            color: '#737373',
                                                            fontSize: 14,
                                                        }}>
                                                            {moment(search.release_date).format('YYYY')}

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
                                                <View style={{
                                                    flexDirection: 'row',
                                                    margin: 10
                                                }}>
                                                    <View style={{
                                                        position: 'relative',
                                                        width: '20%'
                                                    }}>
                                                        <Image
                                                            style={{
                                                                width: 60,
                                                                height: 80,
                                                                borderWidth: 1,
                                                                borderColor: '#fff',
                                                                resizeMode: 'contain'
                                                            }}
                                                            source={{
                                                                uri: `${imgPath.W185}${search.poster_path}`
                                                            }}
                                                        />
                                                        <Badge style={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            left: 0
                                                        }}>
                                                            <Text style={{
                                                                color: '#fff',
                                                                fontSize: 10,
                                                                fontWeight: 'bold'
                                                            }}>
                                                                {search.media_type.toUpperCase()}
                                                            </Text>
                                                        </Badge>
                                                    </View>

                                                    <View style={{
                                                        width: '80%',
                                                        margin: 5
                                                    }}>
                                                        <Text style={{
                                                            fontSize: 14,
                                                            color: '#fff',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {search.name}
                                                        </Text>

                                                        <Text style={{
                                                            color: '#737373',
                                                            fontSize: 14,
                                                        }}>
                                                            {moment(search.first_air_date).format('YYYY')}
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
                                                onPress={() => routeFix('TitleDetails', {
                                                    id: search.id,
                                                    type: search.media_type
                                                })}
                                                key={search.id}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    margin: 10
                                                }}>
                                                    <View style={{
                                                        position: 'relative',
                                                        width: '20%'
                                                    }}>
                                                        <Image
                                                            style={{
                                                                width: 60,
                                                                height: 80,
                                                                borderWidth: 1,
                                                                borderColor: '#fff',
                                                                resizeMode: 'contain'
                                                            }}
                                                            source={{
                                                                uri: `${imgPath.W185}${search.profile_path}`
                                                            }}
                                                        />
                                                        <Badge style={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            left: 0
                                                        }}>
                                                            <Text style={{
                                                                color: '#fff',
                                                                fontSize: 10,
                                                                fontWeight: 'bold'
                                                            }}>
                                                                {search.media_type.capitalize()}
                                                            </Text>
                                                        </Badge>
                                                    </View>

                                                    <View style={{
                                                        width: '80%',
                                                        flexDirection: 'column',
                                                        margin: 5
                                                    }}>
                                                        <Text style={{
                                                            fontSize: 14,
                                                            color: '#fff',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {search.name}
                                                        </Text>

                                                        <Text style={{
                                                            color: '#737373',
                                                            fontSize: 14,
                                                        }}>
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

const style = StyleSheet.create({

})