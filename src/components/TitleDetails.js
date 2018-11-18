import React, { Component, Fragment } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    ActivityIndicator,
    ScrollView,
    TouchableWithoutFeedback,
    TouchableHighlight,
    Linking
} from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'
import moment from 'moment'
import { axiosTMDB } from '../config/axios'
import { imgPath } from '../config/constants'

class TitleDetails extends Component {
    state = {
        movieFetch: false,
        movieSuccessful: false,
        movieFailure: '',
        moviePayload: ''
    }

    async componentDidMount() {
        try {
            const { type, id } = this.props
            this.setState({ movieFetch: true })
            const res = await axiosTMDB.get(`/${type}/${id}?append_to_response=credits,videos,release_dates`)
            this.setState({
                moviePayload: res.data,
                movieSuccessful: true,
                movieFetch: false
            })
        } catch (e) {
            this.setState({
                movieFailure: e,
                movieFetch: false
            })
        }
    }

    trailerHandler = str => {
        Linking.openURL(`https://www.youtube.com/watch?v=${str}`);
    }

    render() {
        const { movieSuccessful, movieFailure, movieFetch } = this.state

        const {
            title, name, release_date, first_air_date,
            backdrop_path, overview, runtime, episode_run_time,
            credits, videos
        } = this.state.moviePayload

        return (
            <View style={styles.container}>
                {movieFetch ?
                    <ActivityIndicator
                        size='large'
                        color='#737373' />
                    : null
                }

                {movieFailure !== '' ? <Text>{movieFailure}</Text> : null}

                {movieSuccessful ?
                    <ScrollView showsVerticalScrollIndicator={false}>

                        <View style={styles.content}>
                            <View>
                                <Image
                                    style={styles.image}
                                    source={{
                                        uri: `${imgPath.W500}${backdrop_path}`
                                    }} />
                                <View style={styles.titleBox}>
                                    <Text style={styles.title}>
                                        {title !== undefined ? title : name}
                                    </Text>
                                </View>
                                <View style={styles.yearBox}>
                                    <Text style={styles.year}>
                                        {release_date !== undefined ?
                                            moment(release_date).format('YYYY')
                                            :
                                            moment(first_air_date).format('YYYY')
                                        }
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.info}>

                                <Icon name='clock' size={18} color='#fff' style={styles.infoIcon} />
                                <Text style={styles.infoText}>
                                    {runtime !== undefined
                                        || episode_run_time !== undefined ?

                                        runtime !== undefined
                                            && runtime !== '' ?
                                            runtime + ' minutes'
                                            :
                                            episode_run_time.map(
                                                v => v
                                            )
                                                .join('/') + ' minutes'
                                        :
                                        null
                                    }
                                </Text>
                                {videos.results.length > 0 ?
                                    <Fragment>
                                        <Icon
                                            name='play'
                                            size={18}
                                            color='#fff'
                                            style={styles.infoIcon} />
                                        <TouchableHighlight
                                            onPress={
                                                () => this.trailerHandler(videos.results[0].key)
                                            }
                                        >
                                            <Text style={styles.infoText}>
                                                Watch Trailer
                                        </Text>
                                        </TouchableHighlight>
                                    </Fragment>
                                    :
                                    null
                                }
                            </View>

                            <View style={styles.bodyBox}>
                                <Text style={styles.overview}>{overview}</Text>
                            </View>

                            <Text style={styles.creditsTitle}>
                                Top Billed Cast
                            </Text>

                            <View style={styles.creditsBox}>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}>
                                    {credits.cast
                                        .slice(0, 10)
                                        .map(cast => {
                                            if (cast.profile_path !== null) {
                                                return (
                                                    <TouchableWithoutFeedback key={cast.id}>
                                                        <View style={styles.creditContainer}>
                                                            <View>
                                                                <Image
                                                                    style={styles.creditsImage}
                                                                    source={{
                                                                        uri: `${imgPath.W500}${cast.profile_path}`
                                                                    }} />


                                                            </View>
                                                            <View style={{
                                                                flexDirection: 'column',
                                                                justifyContent: 'center',
                                                                maxWidth: 100
                                                            }}>
                                                                <Text
                                                                    style={styles.creditsText}>
                                                                    {cast.name}
                                                                </Text>
                                                                <Text
                                                                    style={styles.creditsSubText}>
                                                                    {cast.character}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                )
                                            }
                                        })}
                                </ScrollView>
                            </View>

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
        backgroundColor: '#1b1919',
        justifyContent: 'center'
    },
    content: {
        position: 'relative',
        justifyContent: 'center'
    },
    image: {
        flex: 1,
        width: null,
        height: 200
    },
    titleBox: {
        position: 'absolute',
        maxWidth: 320,
        backgroundColor: '#0093cb',
        bottom: 0,
        left: 0,
        padding: 5
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    yearBox: {
        position: 'absolute',
        top: 20,
        right: 0,
        backgroundColor: '#0093cb'
    },
    year: {
        color: '#fff',
        padding: 5
    },
    bodyBox: {
        alignItems: 'center',
        margin: 10
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    infoIcon: {
        marginLeft: 3
    },
    infoText: {
        fontSize: 12,
        color: '#fff',
        marginLeft: 2
    },
    overview: {
        color: '#737373',
        fontSize: 16,
    },
    creditsTitle: {
        margin: 10,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff'
    },
    creditsBox: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    creditContainer: {
        margin: 5
    },
    creditsImage: {
        width: 100,
        height: 130,
        borderWidth: 1,
        borderColor: '#fff',
        resizeMode: 'contain'
    },
    creditsText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 3
    },
    creditsSubText: {
        color: '#737373',
        fontSize: 10,
        textAlign: 'center',
        flexWrap: 'wrap'
    }
})

export default TitleDetails