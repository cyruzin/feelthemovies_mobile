import React, { PureComponent } from 'react'
import {
    ActivityIndicator,
    FlatList
} from 'react-native'
import { axiosTMDB } from '../../config/axios'
import {
    Container, List, Message, ScrollTop
} from '../UI'

export default class UpComing extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            fetch: false,
            successful: false,
            scroll: false,
            failure: '',
            payload: [],
            currentPage: 1,
            lastPage: 0,
            screenPosition: 0
        }

        this.scrollRef = React.createRef()
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
                `/movie/upcoming?page=${currentPage}`
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
                failure: 'Looks like Thanos snapped his fingers!',
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
            }, () => this.fetchNowPlaying())
        }
    }

    scrollTopHandler = () => {
        this.scrollRef.current.scrollToOffset({ x: 0, y: 0, animated: true })
    }

    render() {
        const {
            fetch, successful, failure, payload, screenPosition
        } = this.state

        return (
            <Container>
                {fetch
                    ? (
                        <ActivityIndicator
                          size="large"
                          color="#737373"
                        />
                    )
                    : null
                }

                {failure !== ''
                    ? <Message text={failure} />
                    : null
                }

                {successful
                    ? (
                        <FlatList
                          showsVerticalScrollIndicator={false}
                          ref={this.scrollRef}
                          onScroll={event => this.setState({
                                screenPosition: event.nativeEvent.contentOffset.y
                            })}
                          keyExtractor={item => item.id.toString()}
                          onEndReachedThreshold={0.5}
                          onEndReached={this.scrollHandler}
                          data={payload.filter(item => item.poster_path !== null)}
                          renderItem={({ item }) => (
                                <List
                                  route="TitleDetails"
                                  image={item.poster_path}
                                  title={item.title}
                                  id={item.id}
                                  type="movie"
                                  date={item.release_date}
                                  body={item.overview}
                                />
                            )}
                        />
                    )
                    : null
                }
                {screenPosition >= 250
                    ? (
                        <ScrollTop
                          onPress={this.scrollTopHandler}
                        />
                    )
                    : null
                }
            </Container>
        )
    }
}
