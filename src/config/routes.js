import React from 'react'
import {
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Text
} from 'react-native'
import { Router, Scene, Actions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/AntDesign'
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons'
import { routeFix, onBackPress } from '../util/helpers';
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
                <Scene
                    key='Recommendation'
                    title='Recommendation'
                    component={Recommendation} />
            </Scene>
        </Router>
    )
}

export const TabBar = () => {
    return (
        <View style={styles.tabBar}>
            <TouchableWithoutFeedback
                onPress={() => Actions.replace('Home')}>
                <View style={styles.tabBarBody}>
                    <Icon name='home' size={22} color='#fff' />
                    <Text style={styles.tabBarItem}>
                        Home
                </Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
                onPress={() => routeFix('Search')}>
                <View style={styles.tabBarBody}>
                    <Icon name='search1' size={22} color='#fff' />
                    <Text style={styles.tabBarItem}>
                        Search
                </Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
                onPress={() => routeFix('Movie')}>
                <View>
                    <IconMC name='movie-roll' size={22} color='#fff' />
                    <Text style={styles.tabBarItem}>
                        Movie
                </Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#0f0e0e',
        height: 60,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 5
    },
    tabBarItem: {
        color: '#fff',
        fontSize: 10
    },
    navigationBar: {
        backgroundColor: '#1b1919'
    },
    navigationBarTitle: {
        color: '#fff',
        fontSize: 18
    },
})