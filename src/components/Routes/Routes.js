import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import { StyleSheet } from 'react-native'
import { Router, Scene } from 'react-native-router-flux'

import { onBackPress, routeFix } from '../../util/helpers';

import Home from '../Home/Home'
import Search from '../Search/Search'
import Recommendation, { Search as RecommendationSearch } from '../Recommendation'
import Movie, { NowPlaying, UpComing } from '../Movie'
import Discovery from '../Discovery'
import TitleDetails from '../TitleDetails/TitleDetails'
import Person from '../Person/Person'
import About from '../About/About'

export default () => {
    return (
        <Router backAndroidHandler={onBackPress}>
            <Scene
                key='Root'
                tintColor='#fff'
                navigationBarStyle={styles.navigationBar}
                titleStyle={styles.navigationBarTitle}>
                <Scene key='Home' component={Home} initial hideNavBar />
                <Scene key='Search' component={Search} hideNavBar />
                <Scene
                    key='Movie'
                    component={Movie}
                    title='Movie'
                    renderRightButton={rigthButton()} />
                <Scene key='NowPlaying' component={NowPlaying} title='Now Playing Movies' />
                <Scene key='UpComing' component={UpComing} title='UpComing Movies' />
                <Scene key='Discovery' component={Discovery} title='Discovery Movies' />
                <Scene key='TitleDetails' component={TitleDetails} title='Details' />
                <Scene key='Person' component={Person} title='Person' />
                <Scene key='About' component={About} title='About' />
                <Scene key='Recommendation' title='Recommendation' component={Recommendation} />
                <Scene
                    key='RecommendationSearch'
                    title='Recommendation Search'
                    component={RecommendationSearch}
                    hideNavBar />
            </Scene>
        </Router>
    )
}

const rigthButton = () => (
    <Icon
        onPress={() => routeFix('About')}
        name='infocirlceo'
        size={20}
        color='#fff'
        style={styles.navigationRightButton} />
)

const styles = StyleSheet.create({
    navigationBar: {
        backgroundColor: '#0f0e0e'
    },
    navigationBarTitle: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'OpenSansCondensed-Bold'
    },
    navigationRightButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        padding: 5,
        marginTop: 5
    }
})