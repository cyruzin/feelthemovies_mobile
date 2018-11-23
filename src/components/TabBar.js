import React from 'react'
import {
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Text
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/AntDesign'
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons'
import { routeFix } from '../util/helpers';

const TabBar = () => {
    return (
        <View style={styles.tabBar}>

            <TouchableWithoutFeedback
                hitSlop={styles.tabHitSlop}
                onPress={() => Actions.replace('Home')}>
                <View style={styles.tabBarBody}>
                    <Icon name='home' size={22} color='#fff' />
                    <Text style={styles.tabBarItem}>
                        Home
                </Text>
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
                hitSlop={styles.tabHitSlop}
                onPress={() => routeFix('Search')}>
                <View style={styles.tabBarBody}>
                    <Icon name='search1' size={22} color='#fff' />
                    <Text style={styles.tabBarItem}>
                        Search
                </Text>
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
                hitSlop={styles.tabHitSlop}
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
        color: '#737373',
        fontSize: 10,
        marginTop: 3
    },
    tabHitSlop: {
        top: 10,
        left: 20,
        bottom: 10,
        right: 20
    }
})

export default TabBar