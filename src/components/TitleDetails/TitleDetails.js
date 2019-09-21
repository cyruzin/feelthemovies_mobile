import React, { PureComponent, Fragment } from 'react'
import {
    StyleSheet,
    View,
    Image,
    ActivityIndicator,
    ScrollView,
    FlatList,
    TouchableHighlight,
    Linking
} from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'
import moment from 'moment'
import { axiosTMDB } from '../../config/axios'
import { imgPath } from '../../config/constants'
import {
 Container, Message, Title, Text, Credits 
} from '../UI'

class TitleDetails extends PureComponent {
    state = {
        fetch: false,
        successful: false,
        failure: '',
        payload: ''
    }

    async componentDidMount() {
        try {
            this.setState({ fetch: true })

            const { type, id } = this.props
            const res = await axiosTMDB.get(
                `/${type}/${id}?append_to_response=credits,videos,release_dates`
            )

            this.setState({
                payload: res.data,
                successful: true,
                fetch: false
            })
        } catch (e) {
            this.setState({
                failure: 'Looks like Thanos snapped his fingers!',
                fetch: false
            })
        }
    }

    getReleaseDates = (data) => {
        let date = null
        data.map((v) => {
            if (v.iso_3166_1 === 'US') {
                v.release_dates
                    .map((v) => {
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
        const crew = []
        data.filter(c => c.job !== ''
            && c.job === crewType)
            .map((c) => {
                crew.push(c.name)
            })
        return crew.length > 0 ? crew.join(', ') : ' Not Available'
    }

    trailerHandler = (str) => {
        Linking.openURL(`https://www.youtube.com/watch?v=${str}`)
    }

    render() {
        const { successful, failure, fetch } = this.state

        const {
            title, name, release_date, first_air_date,
            backdrop_path, overview, runtime, episode_run_time,
            credits, videos, genres, status, budget, revenue,
            created_by, next_episode_to_air, last_air_date,
            number_of_episodes, number_of_seasons,
            release_dates
        } = this.state.payload

        return (
            <Container style={styles.container}>
                {fetch
                    ? <ActivityIndicator
                      size="large"
                      color="#737373"
                    />
                    : null
                }

                {failure !== ''
                    ? <Message text={failure} />
                    :                    null
                }

                {successful
                    ? <ScrollView showsVerticalScrollIndicator={false}>

                        <View style={styles.content}>
                            <View>
                                <Image
                                  style={styles.image}
                                  source={{
                                        uri: `${imgPath.W500}${backdrop_path}`
                                    }}
                                />
                                <View style={styles.titleBox}>
                                    <Title style={styles.title}>
                                        {title !== undefined ? title : name}
                                    </Title>
                                </View>
                                <View style={styles.yearBox}>
                                    <Title style={styles.year}>
                                        {release_date !== undefined
                                            ? moment(release_date).format('YYYY')
                                            :                                            moment(first_air_date).format('YYYY')
                                        }
                                    </Title>
                                </View>
                            </View>

                            <View style={styles.info}>

                                <Icon name="tag" size={18} color="#fff" style={styles.infoIcon} />
                                <Text style={styles.infoText}>
                                    {genres.slice(0, 4).map(v => v.name).join(', ')}
                                </Text>

                                {videos.results.length > 0
                                    ? <Fragment>
                                        <Icon
                                          name="play"
                                          size={18}
                                          color="#fff"
                                          style={styles.infoIcon}
                                        />
                                        <TouchableHighlight
                                          onPress={() => this.trailerHandler(videos.results[0].key)}
                                        >
                                            <Text style={styles.infoText}>
                                                Watch Trailer
                                            </Text>
                                        </TouchableHighlight>
                                    </Fragment>
                                    :                                    null
                                }
                            </View>

                            <View style={styles.bodyBox}>
                                <Text style={styles.overview}>{overview}</Text>
                            </View>

                            <Title style={styles.sectionTitle}>
                                Top Billed Cast
                            </Title>

                            <View style={styles.creditsBox}>
                                <FlatList
                                  horizontal
                                  showsHorizontalScrollIndicator={false}
                                  keyExtractor={item => item.id.toString()}
                                  data={
                                        credits.cast
                                            .slice(0, 20)
                                            .filter(title => title.profile_path !== null)
                                    }
                                  renderItem={({ item }) => (
                                        <Credits
                                          route="Person"
                                          id={item.id}
                                          image={item.profile_path}
                                          title={item.name}
                                          character={item.character}
                                        />
                                    )
                                    }
                                />
                            </View>

                            <Title style={[styles.sectionTitle, { marginBottom: 5 }]}>
                                Other Info
                            </Title>

                            {/* Movie */}
                            <View style={styles.otherInfo}>
                                {title !== undefined
                                    ? <View style={styles.otherInfoBox}>

                                        <Text style={styles.otherInfoText}>
                                            Status: 
{' '}
{status}
                                        </Text>

                                        {runtime !== undefined
                                            ? <Text style={styles.otherInfoText}>
                                                Runtime: 
{' '}
{
                                                    runtime !== null ?
                                                        runtime + ' minutes'
                                                        :
                                                        'Not Available'
                                                }
                                            </Text>
                                            :                                            null
                                        }

                                        <Text style={styles.otherInfoText}>
                                            Director: 
{' '}
{
                                                this.getCrew(credits.crew, 'Director')
                                            }
                                        </Text>

                                        <Text style={styles.otherInfoText}>
                                            Writer: 
{' '}
{
                                                this.getCrew(credits.crew, 'Writer')
                                            }
                                        </Text>

                                        <Text style={styles.otherInfoText}>
                                            Blu-ray release date: 
{' '}
{
                                                this.getReleaseDates(
                                                    release_dates.results
                                                )
                                            }
                                        </Text>

                                        {budget !== '' && budget > 0
                                            ? <Text style={styles.otherInfoText}>
                                                Budget: $
{budget.format(2)}
                                            </Text>
                                            :                                            null
                                        }

                                        {revenue !== '' && revenue > 0
                                            ? <Text style={styles.otherInfoText}>
                                                Revenue: $
{revenue.format(2)}
                                            </Text>
                                            :                                            null
                                        }
                                    </View>
                                    :                                    null
                                }

                                {/* TV Shows */}
                                {name !== undefined
                                    ? <View style={styles.otherInfoBox}>

                                        <Text style={styles.otherInfoText}>
                                            Status: 
{' '}
{status}
                                        </Text>

                                        {episode_run_time !== undefined
                                            ? <Text style={styles.otherInfoText}>
                                                Runtime: 
{' '}
{
                                                    episode_run_time !== null ?
                                                        episode_run_time.map(
                                                            v => v
                                                        )
                                                            .join('/') + ' minutes'
                                                        :
                                                        'Not Available'
                                                }
                                            </Text>
                                            :                                            null
                                        }


                                        <Text style={styles.otherInfoText}>
                                            Creator: 
{' '}
{
                                                created_by.length > 0 ?
                                                    created_by.map(c => c.name)
                                                        .join(', ')
                                                    :
                                                    'Not Available'
                                            }
                                        </Text>

                                        {number_of_seasons !== ''
                                            ? <Text style={styles.otherInfoText}>
                                                Seasons: 
{' '}
{number_of_seasons}
                                            </Text>
                                            :                                            null
                                        }

                                        {number_of_episodes !== ''
                                            ? <Text style={styles.otherInfoText}>
                                                Episodes: 
{' '}
{number_of_episodes}
                                            </Text>
                                            :                                            null
                                        }

                                        {first_air_date !== ''
                                            ? <Text style={styles.otherInfoText}>
                                                First Air Date: 
{' '}
{first_air_date}
                                            </Text>
                                            :                                            null
                                        }

                                        {last_air_date !== ''
                                            ? <Text style={styles.otherInfoText}>
                                                Last Air Date: 
{' '}
{last_air_date}
                                            </Text>
                                            :                                            null
                                        }

                                        {next_episode_to_air !== null
                                            ? <Text style={styles.otherInfoText}>
                                                Next Episode to Air: 
{' '}
{
                                                    next_episode_to_air.air_date
                                                }
                                            </Text>
                                            :                                            null
                                        }

                                    </View>
                                    :                                    null
                                }
                            </View>
                        </View>
                    </ScrollView>
                    :                    null
                }
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0e0e',
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
        fontSize: 20
    },
    yearBox: {
        position: 'absolute',
        top: 20,
        right: 0,
        backgroundColor: '#0093cb'
    },
    year: {
        color: '#fff',
        padding: 5,
        fontSize: 16
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
        fontSize: 16,
        color: '#fff',
        marginLeft: 2
    },
    overview: {
        color: '#737373',
        fontSize: 18,
    },
    sectionTitle: {
        margin: 10,
        fontSize: 20,
        color: '#fff'
    },
    creditsBox: {
        marginLeft: 10,
        marginRight: 10,
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
        fontSize: 18,
        color: '#737373',
        marginTop: 5
    }
})

export default TitleDetails
