import React, { Component } from 'react'
import {
    ScrollView,
    View,
    Text,
    Image,
    TouchableWithoutFeedback,
    ActivityIndicator,
    StyleSheet
} from 'react-native'
import moment from 'moment'
import orderBy from 'lodash/orderBy'
import { axiosTMDB } from '../config/axios'
import { imgPath } from '../config/constants'
import { routeFix } from '../util/helpers'
import { Container, Badge, Message } from './UI'

export default class Person extends Component {
    state = {
        personFetch: false,
        personSuccessful: false,
        personFailure: '',
        personPayload: ''
    }

    async componentDidMount() {
        try {
            this.setState({ personFetch: true })

            const { id } = this.props

            const res = await axiosTMDB.get(
                `/person/${id}?append_to_response=combined_credits`
            )

            this.setState({
                personPayload: res.data,
                personSuccessful: true,
                personFetch: false
            })

        } catch (e) {
            this.setState({
                personFailure: 'Something went wrong',
                personFetch: false
            })
        }
    }

    render() {
        const {
            personFetch, personSuccessful,
            personFailure
        } = this.state

        const {
            name, profile_path, biography, combined_credits,
            birthday, deathday, gender, place_of_birth
        } = this.state.personPayload

        return (
            <Container>

                {personFetch ?
                    <ActivityIndicator
                        size='large'
                        color='#737373' />
                    : null
                }

                {personFailure !== '' ?
                    <Message text={personFailure} />
                    :
                    null
                }

                {personSuccessful ?
                    <ScrollView showsVerticalScrollIndicator={false}>

                        <View style={styles.content}>

                            <View style={styles.imageBox}>
                                <Image
                                    style={styles.image}
                                    source={{
                                        uri: `${imgPath.W500}${profile_path}`
                                    }}
                                />
                                <Badge style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0
                                }}>
                                    <Text style={styles.name}>{name}</Text>
                                </Badge>
                            </View>

                            {biography !== '' ?
                                <View style={styles.biographyBox}>
                                    <Text style={styles.biography}>
                                        {biography}
                                    </Text>
                                </View>
                                :
                                null
                            }

                            {combined_credits.cast.length > 0 ?
                                <View>
                                    <View style={{
                                        margin: 10
                                    }}>
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            color: '#fff'
                                        }}>
                                            Known For
                                </Text>
                                    </View>

                                    <View style={{
                                        marginLeft: 10,
                                        marginRight: 10
                                    }}>
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}>
                                            {
                                                orderBy(combined_credits.cast, 'vote_count', 'desc')
                                                    .slice(0, 20)
                                                    .filter(c =>
                                                        c.character !== 'Himself'
                                                        && c.poster_path !== null
                                                    )
                                                    .map(c =>
                                                        <TouchableWithoutFeedback
                                                            key={c.id}
                                                            onPress={() => routeFix('TitleDetails', {
                                                                id: c.id,
                                                                type: c.media_type
                                                            })}>
                                                            <View
                                                                style={{
                                                                    padding: 5,
                                                                    flexDirection: 'column'
                                                                }}>
                                                                <View>
                                                                    <Image
                                                                        style={{
                                                                            flex: 1,
                                                                            width: 100,
                                                                            height: 130,
                                                                            borderWidth: 1,
                                                                            borderColor: '#fff',
                                                                            resizeMode: 'contain'
                                                                        }}
                                                                        source={{
                                                                            uri: `${imgPath.W185}${c.poster_path}`
                                                                        }}
                                                                    />
                                                                </View>
                                                                <View
                                                                    style={{
                                                                        flexDirection: 'column',
                                                                        maxWidth: 100
                                                                    }}>
                                                                    <Text
                                                                        style={{
                                                                            color: '#fff',
                                                                            fontSize: 12,
                                                                            maxWidth: 100,
                                                                            flexWrap: 'wrap',
                                                                            textAlign: 'center',
                                                                            fontWeight: 'bold',
                                                                            marginTop: 5
                                                                        }}>
                                                                        {c.title !== undefined ?
                                                                            c.title : c.name
                                                                        }
                                                                    </Text>
                                                                    <Text style={{
                                                                        color: '#737373',
                                                                        fontSize: 12,
                                                                        flexWrap: 'wrap',
                                                                        textAlign: 'center',
                                                                        marginTop: 3
                                                                    }}>
                                                                        {c.release_date !== undefined ?
                                                                            moment(c.release_date).format('YYYY')
                                                                            :
                                                                            moment(c.first_air_date).format('YYYY')
                                                                        }
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    )
                                            }
                                        </ScrollView>
                                    </View>
                                </View>
                                :
                                null
                            }

                            <View style={{
                                margin: 10
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: '#fff'
                                }}>
                                    Other Info
                                </Text>
                            </View>

                            <View style={{
                                marginLeft: 10,
                                marginRight: 10,
                                marginBottom: 10
                            }}>
                                {gender !== null ?
                                    <Text style={styles.otherInfoText}>
                                        Gender: {gender === 1 ? 'Female' : 'Male'}
                                    </Text>
                                    :
                                    null
                                }

                                {birthday !== null ?
                                    <Text style={styles.otherInfoText}>
                                        Birthday: {birthday}
                                    </Text>
                                    :
                                    null
                                }

                                {deathday !== null ?
                                    <Text style={styles.otherInfoText}>
                                        Day of Death: {deathday}
                                    </Text>
                                    :
                                    null
                                }

                                {place_of_birth !== null ?
                                    <Text style={styles.otherInfoText}>
                                        Place of Birth: {place_of_birth}
                                    </Text>
                                    :
                                    null
                                }

                            </View>

                        </View>

                    </ScrollView>
                    :
                    null
                }

            </Container>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        position: 'relative',
        justifyContent: 'center'
    },
    imageBox: {
        flex: 1,
        position: 'relative',
        marginBottom: 10
    },
    image: {
        flex: 1,
        width: null,
        height: 400,
        resizeMode: 'cover'
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff'
    },
    biographyBox: {
        margin: 15,
        alignItems: 'center'
    },
    biography: {
        color: '#737373',
        fontSize: 16
    },
    otherInfoText: {
        fontSize: 16,
        color: '#737373',
        marginTop: 5
    }
})