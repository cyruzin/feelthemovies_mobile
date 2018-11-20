import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { StyleSheet } from 'react-native'
import { Router, Scene } from 'react-native-router-flux'
import { onBackPress, routeFix } from '../util/helpers';
import Home from '../components/Home'
import Search from '../components/Search'
import Recommendation from '../components/Recommendation'
import Movie from '../components/Movie/Movie'
import TitleDetails from '../components/TitleDetails'
import Person from '../components/Person'
import About from '../components/About'

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
                <Scene key='Movie' component={Movie} title='Movie'
                    renderRightButton={() =>
                        <Icon
                            onPress={() => routeFix('About')}
                            name='info'
                            size={22}
                            color='#fff'
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 10
                            }} />} />
                <Scene key='TitleDetails' component={TitleDetails} title='Details' />
                <Scene key='Person' component={Person} title='Person' />
                <Scene key='About' component={About} title='About' />
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