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
        scroll: false,
        failure: '',
        payload: [],
        currentPage: 1,
        lastPage: 0
    }

    componentDidMount() {
        this.fetchNowPlaying()
    }

    fetchNowPlaying = async () => {
        const { currentPage, scroll, payload } = this.state

        if (!scroll) {
            this.setState({ fetch: true })
        }

        try {

            const res = await axiosTMDB.get(
                `/movie/now_playing?region=us&page=${currentPage}`
            )

            this.setState({
                payload: [
                    ...payload,
                    ...res.data.results
                ],
                lastPage: res.data.total_pages,
                successful: true,
                fetch: false,
                scroll: false
            })

        } catch (e) {
            this.setState({
                failure: 'Something went wrong',
                fetch: false,
                scroll: false
            })
        }
    }

    scrollHandler = () => {
        const {
            currentPage, lastPage
        } = this.state

        if (currentPage < lastPage) {
            this.setState({
                currentPage: currentPage + 1,
                scroll: true
            }, () => this.fetchNowPlaying()
            )
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
                        onEndReachedThreshold={0.5}
                        onEndReached={this.scrollHandler}
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