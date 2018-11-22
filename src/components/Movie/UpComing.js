import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableWithoutFeedback,
    Image,
    ActivityIndicator
} from 'react-native'
import moment from 'moment'
import { axiosTMDB } from '../../config/axios'
import { imgPath } from '../../config/constants'
import { routeFix } from '../../util/helpers'
import { Container, Message } from '../UI'

export default class UpComing extends Component {

    state = {
        movieFetch: false,
        movieSuccessful: false,
        movieFailure: '',
        moviePayload: []
    }

    async componentDidMount() {
        try {
            this.setState({ movieFetch: true })

            const res = await axiosTMDB.get(
                `/movie/upcoming?region=us&page=1`
            )

            this.setState({
                moviePayload: res.data.results,
                movieSuccessful: true,
                movieFetch: false
            })

        } catch (e) {
            this.setState({
                movieFailure: 'Something went wrong',
                movieFetch: false
            })
        }
    }

    render() {
        const {
            movieFetch, moviePayload,
            movieSuccessful, movieFailure
        } = this.state

        return (
            <Container>
                <View style={{ alignItems: 'center' }}>

                    {movieFetch ?
                        <ActivityIndicator
                            size='large'
                            color='#737373' />
                        : null
                    }


                    {movieFailure !== '' ?
                        <Message text={movieFailure} />
                        :
                        null
                    }

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {movieSuccessful ?
                            <View>
                                <View style={{
                                    margin: 10
                                }}>
                                    {moviePayload
                                        .filter(movie => movie.poster_path !== null)
                                        .map(movie => {
                                            return (
                                                <TouchableWithoutFeedback
                                                    onPress={() =>
                                                        routeFix('TitleDetails', {
                                                            id: movie.id,
                                                            type: 'movie'
                                                        })}
                                                    key={movie.id}>
                                                    <View style={styles.titleBox}>
                                                        <View style={styles.titleImage}>
                                                            <Image
                                                                style={styles.image}
                                                                source={{
                                                                    uri: `${imgPath.W185}${movie.poster_path}`
                                                                }}
                                                            />
                                                        </View>

                                                        <View style={styles.titleInfo}>
                                                            <Text style={styles.titleInfoText}>
                                                                {movie.title}
                                                            </Text>

                                                            <Text style={styles.titleInfoSubText}>
                                                                {moment(movie.release_date)
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
                </View>
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
        fontSize: 14
    }
})
