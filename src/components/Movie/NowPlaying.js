import React, { PureComponent } from 'react'
import {
    ActivityIndicator,
    FlatList
} from 'react-native'
import { axiosTMDB } from '../../config/axios'
import { Container, List, Message } from '../UI'

export default class NowPlaying extends PureComponent {

    state = {
        fetch: false,
        successful: false,
        failure: '',
        payload: []
    }

    async componentDidMount() {
        try {
            this.setState({ fetch: true })

            const res = await axiosTMDB.get(
                `/movie/now_playing?region=us&page=1`
            )

            this.setState({
                payload: res.data.results,
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
        const { fetch, successful, failure, payload } = this.state

        return (
            <Container>
                {fetch ?
                    <ActivityIndicator
                        size='large'
                        color='#737373' />
                    : null
                }

                {failure !== '' ?
                    <Message text={moviefailure} />
                    :
                    null
                }

                {successful ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        keyExtractor={item => item.id.toString()}
                        data={payload.filter(item => item.poster_path !== null)}
                        renderItem={({ item }) =>
                            <List
                                route='TitleDetails'
                                image={item.poster_path}
                                title={item.title}
                                id={item.id}
                                type='movie'
                                date={item.release_date}
                                body={item.overview}
                            />
                        }
                    />
                    :
                    null
                }
            </Container>
        )
    }
}