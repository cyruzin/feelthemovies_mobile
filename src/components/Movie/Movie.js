import React from 'react'
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { routeFix } from '../../util/helpers'
import { Container, Text } from '../UI'

const Movie = () => {
    return (
        <Container>
            <View style={styles.content}>
                <TouchableWithoutFeedback
                    hitSlop={styles.hitSlop}
                    onPress={() => routeFix('NowPlaying')}>
                    <View style={styles.box}>
                        <Icon name='tago' size={20} color='#fff' />
                        <Text style={styles.boxText}>Now Playing</Text>
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                    hitSlop={styles.hitSlop}
                    onPress={() => routeFix('UpComing')}>
                    <View style={styles.box}>
                        <Icon name='playcircleo' size={20} color='#fff' />
                        <Text style={styles.boxText}>UpComing</Text>
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                    hitSlop={styles.hitSlop}
                    onPress={() => routeFix('RecommendationSearch')}>
                    <View style={styles.box}>
                        <Icon name='search1' size={20} color='#fff' />
                        <Text style={styles.boxText}>Recommendation Search</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </Container>
    )
}

export default Movie

const styles = StyleSheet.create({
    content: {
        flex: 1,
        margin: 10,
        marginTop: 20,
        marginLeft: 25
    },
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        padding: 5
    },
    boxText: {
        color: '#737373',
        fontSize: 18,
        marginLeft: 15
    },
    hitSlop: {
        top: 10,
        left: 20,
        bottom: 10,
        right: 20
    }

})