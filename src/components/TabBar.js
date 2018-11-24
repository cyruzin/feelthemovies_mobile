import React, { Component } from 'react'
import {
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/AntDesign'
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons'
import { routeFix } from '../util/helpers';
import { Text } from './UI'

class TabBar extends Component {

    state = {
        activeTab: 'Home',
        activeColor: '#fff',
        inactiveColor: '#737373'
    }

    isActive = route => {
        Actions.replace(route)
        this.setState({ activeTab: route })
    }



    render() {
        const { activeTab, activeColor, inactiveColor } = this.state

        return (
            <View style={styles.tabBar}>

                <TouchableWithoutFeedback
                    hitSlop={styles.tabHitSlop}
                    onPress={() => this.isActive('Home')}>
                    <View style={styles.tabBarBody}>
                        <Icon name='home' size={22} color='#fff' />
                        <Text style={[styles.tabBarItem, {
                            color: activeTab === 'Home' ? activeColor : inactiveColor
                        }]}>
                            Home
                        </Text>
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                    hitSlop={styles.tabHitSlop}
                    onPress={() => this.isActive('Search')}>
                    <View style={styles.tabBarBody}>
                        <Icon name='search1' size={22} color='#fff' />
                        <Text style={[styles.tabBarItem, {
                            color: activeTab === 'Search' ? activeColor : inactiveColor
                        }]}>
                            Search
                </Text>
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                    hitSlop={styles.tabHitSlop}
                    onPress={() => this.isActive('Movie')}>
                    <View>
                        <IconMC name='movie-roll' size={22} color='#fff' />
                        <Text style={[styles.tabBarItem, {
                            color: activeTab === 'Movie' ? activeColor : inactiveColor
                        }]}>
                            Movie
                </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
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
        fontSize: 10,
        marginTop: 3,
        textAlign: 'center'
    },
    tabHitSlop: {
        top: 10,
        left: 20,
        bottom: 10,
        right: 20
    }
})

export default TabBar