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
import { routeFix } from '../util/helpers'

class TitleDetails extends Component {
    state = {
        titleFetch: false,
        titleSuccessful: false,
        titleFailure: '',
        titlePayload: ''
    }

    async componentDidMount() {
        try {
            const { type, id } = this.props
            this.setState({ titleFetch: true })
            const res = await axiosTMDB.get(`/${type}/${id}?append_to_response=credits,videos,release_dates`)
            this.setState({
                titlePayload: res.data,
                titleSuccessful: true,
                titleFetch: false
            })
        } catch (e) {
            this.setState({
                titleFailure: e,
                titleFetch: false
            })
        }
    }

    getReleaseDates = data => {
        let date = null
        data.map(v => {
            if (v.iso_3166_1 === 'US') {
                v.release_dates
                    .map(v => {
                        if (
                            v.release_date !== undefined
                            && v.type === 5
                        ) {
                            date = moment(v.release_date).format('YYYY-MM-DD')
                        }
                    })
            }
        })
        return date !== null ? date : ' Not Available'
    }

    getCrew = (data, crewType) => {
        let crew = []
        data.filter(c =>
            c.job !== ''
            && c.job === crewType
        )
            .map(c => {
                crew.push(c.name)
            })
        return crew.length > 0 ? crew.join(', ') : ' Not Available'
    }

    trailerHandler = str => {
        Linking.openURL(`https://www.youtube.com/watch?v=${str}`);
    }

    render() {
        const { titleSuccessful, titleFailure, titleFetch } = this.state

        const {
            title, name, release_date, first_air_date,
            backdrop_path, overview, runtime, episode_run_time,
            credits, videos, genres, status, budget, revenue,
            created_by, next_episode_to_air, last_air_date,
            number_of_episodes, number_of_seasons,
            release_dates
        } = this.state.titlePayload

        return (
            <View style={styles.container}>
                {titleFetch ?
                    <ActivityIndicator
                        size='large'
                        color='#737373' />
                    : null
                }

                {titleFailure !== '' ? <Text>{titleFailure}</Text> : null}

                {titleSuccessful ?
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

                                <Icon name='tag' size={18} color='#fff' style={styles.infoIcon} />
                                <Text style={styles.infoText}>
                                    {genres.slice(0, 4).map(v => v.name).join(', ')}
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

                            <Text style={styles.sectionTitle}>
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
                                                    <TouchableWithoutFeedback
                                                        key={cast.id}
                                                        onPress={() => routeFix('Person', {
                                                            id: cast.id
                                                        })}>
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

                            <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>
                                Other Info
                            </Text>

                            {/* Movie */}
                            <View style={styles.otherInfo}>
                                {title !== undefined ?
                                    <View style={styles.otherInfoBox}>

                                        <Text style={styles.otherInfoText}>
                                            Status: {status}
                                        </Text>

                                        {runtime !== undefined
                                            || episode_run_time !== undefined ?
                                            <Text style={styles.otherInfoText}>
                                                Runtime: {
                                                    runtime !== undefined
                                                        && runtime !== '' ?
                                                        runtime + ' minutes'
                                                        :
                                                        episode_run_time.map(
                                                            v => v
                                                        )
                                                            .join('/') + ' minutes'
                                                }
                                            </Text>
                                            :
                                            null
                                        }

                                        <Text style={styles.otherInfoText}>
                                            Director: {
                                                this.getCrew(credits.crew, 'Director')
                                            }
                                        </Text>

                                        <Text style={styles.otherInfoText}>
                                            Writer: {
                                                this.getCrew(credits.crew, 'Writer')
                                            }
                                        </Text>

                                        <Text style={styles.otherInfoText}>
                                            Blu-ray release date: {
                                                this.getReleaseDates(
                                                    release_dates.results
                                                )
                                            }
                                        </Text>

                                        {budget !== '' && budget > 0 ?
                                            <Text style={styles.otherInfoText}>
                                                Budget: ${budget.format(2)}
                                            </Text>
                                            :
                                            null
                                        }

                                        {revenue !== '' && revenue > 0 ?
                                            <Text style={styles.otherInfoText}>
                                                Revenue: ${revenue.format(2)}
                                            </Text>
                                            :
                                            null
                                        }
                                    </View>
                                    :
                                    null
                                }

                                {/* TV Shows */}
                                {name !== undefined ?
                                    <View style={styles.otherInfoBox}>

                                        <Text style={styles.otherInfoText}>
                                            Status: {status}
                                        </Text>

                                        {runtime !== undefined
                                            || episode_run_time !== undefined ?
                                            <Text style={styles.otherInfoText}>
                                                Runtime: {
                                                    runtime !== undefined
                                                        && runtime !== '' ?
                                                        runtime + ' minutes'
                                                        :
                                                        episode_run_time.map(
                                                            v => v
                                                        )
                                                            .join('/') + ' minutes'
                                                }
                                            </Text>
                                            :
                                            null
                                        }

                                        <Text style={styles.otherInfoText}>
                                            Creator: {
                                                created_by.map(c => c.name)
                                                    .join(', ')
                                            }
                                        </Text>

                                        {number_of_seasons !== '' ?
                                            <Text style={styles.otherInfoText}>
                                                Seasons: {number_of_seasons}
                                            </Text>
                                            :
                                            null
                                        }

                                        {number_of_episodes !== '' ?
                                            <Text style={styles.otherInfoText}>
                                                Episodes: {number_of_episodes}
                                            </Text>
                                            :
                                            null
                                        }

                                        {first_air_date !== '' ?
                                            <Text style={styles.otherInfoText}>
                                                First Air Date: {first_air_date}
                                            </Text>
                                            :
                                            null
                                        }

                                        {last_air_date !== '' ?
                                            <Text style={styles.otherInfoText}>
                                                Last Air Date: {last_air_date}
                                            </Text>
                                            :
                                            null
                                        }

                                        {next_episode_to_air !== null ?
                                            <Text style={styles.otherInfoText}>
                                                Next Episode to Air: {
                                                    next_episode_to_air.air_date
                                                }
                                            </Text>
                                            :
                                            null
                                        }

                                    </View>
                                    :
                                    null
                                }
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
        margin: 5,
        marginTop: 25
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
    sectionTitle: {
        margin: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff'
    },
    creditsBox: {
        marginLeft: 10,
        marginRight: 10,
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
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 5
    },
    creditsSubText: {
        color: '#737373',
        fontSize: 12,
        textAlign: 'center',
        flexWrap: 'wrap',
        marginTop: 3
    },
    otherInfo: {
        flex: 1
    },
    otherInfoBox: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10
    },
    otherInfoText: {
        fontSize: 16,
        color: '#737373',
        marginTop: 5
    }
})

export default TitleDetails