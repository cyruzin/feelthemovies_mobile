import React, { Component } from 'react'
import {
    StyleSheet, Image, View, Text,
    ScrollView, ActivityIndicator,
    TouchableHighlight
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'
import axios from '../config/axios'
import { imgPath } from '../config/constants'
import { removeHTML, routeFix } from '../util/helpers'

export default class Home extends Component {

    state = {
        recommendationFetch: false,
        recommendationSuccess: false,
        recommendationError: '',
        recommendationPayload: []
    }

    componentDidMount() {
        this.fetchRecommendations()
    }

    async fetchRecommendations() {
        try {
            this.setState({ recommendationFetch: true })
            const res = await axios.get('/recommendations')
            this.setState({
                recommendationPayload: res.data.data,
                recommendationSuccess: true,
                recommendationFetch: false
            })
        } catch (e) {
            this.setState({
                recommendationError: e,
                recommendationFetch: false
            })
        }
    }

    render() {
        const {
            container, content, contentBody, contentTitle,
            contentImage, contentGenresText, contentGenres,
            contentDate, contentDateText,
            contentFoot, contentFootBody
        } = styles

        const {
            recommendationFetch, recommendationSuccess,
            recommendationPayload, recommendationError
        } = this.state

        return (
            <View style={container}>
                {recommendationFetch ?
                    <ActivityIndicator
                        size='large'
                        color='#737373' />
                    : null
                }

                {recommendationError !== '' ? <Text>{recommendationError}</Text> : null}

                {recommendationSuccess ?
                    <ScrollView
                        showsVerticalScrollIndicator={false}>
                        <View>
                            {recommendationPayload.map(recommendation => (
                                <View key={recommendation.id} >
                                    <TouchableHighlight
                                        onPress={() => routeFix('Recommendation', {
                                            id: recommendation.id,
                                            recommendation: recommendation
                                        })}>
                                        <View>
                                            <Image style={contentImage}
                                                source={{
                                                    uri: `${imgPath.W500}${recommendation.backdrop}`
                                                }} />
                                        </View>
                                    </TouchableHighlight>
                                    <View style={contentDate}>
                                        <Text style={contentDateText}>
                                            {moment(recommendation.created_at).format('D MMM')}
                                        </Text>
                                    </View>
                                    <View style={{ position: 'relative' }}>
                                        <View style={contentGenres}>
                                            <Text style={contentGenresText}>
                                                {recommendation.genres
                                                    .slice(0, 4)
                                                    .map(g => g.name)
                                                    .join(', ')}
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableHighlight
                                        onPress={() => routeFix('Recommendation', {
                                            id: recommendation.id
                                        })}>
                                        <View style={content}>

                                            <Text style={contentTitle}>
                                                {recommendation.title}
                                            </Text>
                                            <Text style={contentBody}>
                                                {removeHTML(recommendation.body)}
                                            </Text>
                                        </View>
                                    </TouchableHighlight>
                                    <View style={contentFoot}>
                                        <Text style={contentFootBody}>
                                            <Icon name='clock-outline'
                                                size={12} color='#737373' /> {
                                                moment(recommendation.created_at).fromNow()
                                            }
                                        </Text>
                                        {/* <Text style={contentFootBody}>
                                            <Icon name='comment-multiple-outline'
                                                size={12} color='#737373' /> 8 comments
                                        </Text> */}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                    :
                    null
                }
            </View>
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
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
        fontFamily: 'Open Sans'
    },
    contentBody: {
        fontSize: 16,
        textAlign: 'justify',
        marginTop: 10,
        color: '#737373',
        fontFamily: 'Open Sans'
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