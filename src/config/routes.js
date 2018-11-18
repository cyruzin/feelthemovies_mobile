import React from 'react'
import { StyleSheet } from 'react-native'
import { Router, Scene } from 'react-native-router-flux'
import { onBackPress } from '../util/helpers';
import Home from '../components/Home'
import Search from '../components/Search'
import Recommendation from '../components/Recommendation'
import Movie from '../components/Movie/Movie'
import TitleDetails from '../components/TitleDetails'

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
                <Scene key='Movie' component={Movie} hideNavBar />
                <Scene key='TitleDetails' component={TitleDetails} title='Details' />
                <Scene key='Recommendation' title='Recommendation' component={Recommendation} />

            </Scene>
        </Router>
    )
}

const styles = StyleSheet.create({
    navigationBar: {
        backgroundColor: '#1b1919'
    },
    navigationBarTitle: {
        color: '#fff',
        fontSize: 18
    },
})