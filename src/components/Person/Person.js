import React, { PureComponent } from 'react'
import {
    ScrollView,
    FlatList,
    View,
    Image,
    ActivityIndicator,
    StyleSheet
} from 'react-native'
import orderBy from 'lodash/orderBy'
import { axiosTMDB } from '../../config/axios'
import { imgPath } from '../../config/constants'
import { Container, Badge, Message, Title, Text, Credits } from '../UI'

export default class Person extends PureComponent {
    state = {
        fetch: false,
        successful: false,
        failure: '',
        payload: ''
    }

    async componentDidMount() {
        try {
            this.setState({ fetch: true })

            const { id } = this.props

            const res = await axiosTMDB.get(
                `/person/${id}?append_to_response=combined_credits`
            )

            this.setState({
                payload: res.data,
                successful: true,
                fetch: false
            })

        } catch (e) {
            this.setState({
                failure: 'Something went wrong',
                fetch: false
            })
        }
    }

    render() {
        const {
            fetch, successful, failure
        } = this.state

        const {
            name, profile_path, biography, combined_credits,
            birthday, deathday, gender, place_of_birth
        } = this.state.payload

        return (
            <Container>

                {fetch ?
                    <ActivityIndicator
                        size='large'
                        color='#737373' />
                    : null
                }

                {failure !== '' ?
                    <Message text={failure} />
                    :
                    null
                }

                {successful ?
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
                                    <Title style={styles.name}>{name}</Title>
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
                                    <View style={styles.section}>
                                        <Title style={styles.sectionTitle}>
                                            Known For
                                        </Title>
                                    </View>

                                    <View style={{
                                        marginLeft: 10,
                                        marginRight: 10
                                    }}>
                                        <FlatList
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={item => item.id.toString()}
                                            data={orderBy(
                                                combined_credits.cast, 'vote_count', 'desc'
                                            )
                                                .slice(0, 20)
                                                .filter(c =>
                                                    c.character !== 'Himself'
                                                    && c.poster_path !== null
                                                )}
                                            renderItem={({ item }) => (
                                                <Credits
                                                    route='TitleDetails'
                                                    id={item.id}
                                                    type={item.media_type}
                                                    title={item.title !== undefined ?
                                                        item.title : item.name
                                                    }
                                                    date={item.release_date !== undefined ?
                                                        item.release_date
                                                        :
                                                        item.first_air_date
                                                    }
                                                    image={item.poster_path}
                                                />
                                            )
                                            }
                                        />
                                    </View>
                                </View>
                                :
                                null
                            }

                            <View style={styles.section}>
                                <Title style={styles.sectionTitle}>
                                    Other Info
                                </Title>
                            </View>

                            <View style={styles.otherInfoBox}>
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
        fontSize: 20,
        color: '#fff'
    },
    biographyBox: {
        margin: 15,
        alignItems: 'center'
    },
    biography: {
        color: '#737373',
        fontSize: 18
    },
    section: {
        margin: 10
    },
    sectionTitle: {
        fontSize: 20,
        color: '#fff'
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