import React, { PureComponent } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableWithoutFeedback,
    Image,
    ActivityIndicator
} from 'react-native'
import moment from 'moment'
import { axiosTMDB } from '../../config/axios'
import { imgPath } from '../../config/constants'
import { routeFix } from '../../util/helpers'
import { Container, Message } from '../UI'

export default class UpComing extends PureComponent {

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

                    {movieSuccessful ?
                        <View style={{ margin: 10 }}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                keyExtractor={item => item.id.toString()}
                                data={moviePayload
                                    .filter(movie => movie.poster_path !== null)
                                }
                                renderItem={({ item }) => (
                                    <TouchableWithoutFeedback
                                        onPress={() =>
                                            routeFix('TitleDetails', {
                                                id: item.id,
                                                type: 'movie'
                                            })}
                                        key={item.id}>
                                        <View style={styles.titleBox}>
                                            <View style={styles.titleImage}>
                                                <Image
                                                    style={styles.image}
                                                    source={{
                                                        uri: `${imgPath.W185}${item.poster_path}`
                                                    }}
                                                />
                                            </View>

                                            <View style={styles.titleInfo}>
                                                <Text style={styles.titleInfoText}>
                                                    {item.title}
                                                </Text>

                                                <Text style={styles.titleInfoSubText}>
                                                    {moment(item.release_date)
                                                        .format('YYYY')}
                                                </Text>
                                            </View>

                                        </View>
                                    </TouchableWithoutFeedback>
                                )}
                            />
                        </View>
                        :
                        null
                    }
                </View>
            </Container >
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
