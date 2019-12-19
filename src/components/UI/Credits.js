import React from 'react'
import {
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Image
} from 'react-native'

import moment from 'moment'

import { imgPath } from '../../config/constants'
import { routeFix } from '../../util/helpers'

import Title from './Title'
import Text from './Text'

export default (props) => {
    const {
        route, id, type, image, title, date, character
    } = props

    return (
        <TouchableWithoutFeedback
            onPress={() => routeFix(route, { id, type })}
        >
            <View style={styles.container}>
                <View>
                    <Image
                        style={styles.image}
                        source={{
                            uri: `${imgPath.W300}${image}`
                        }}
                    />
                </View>
                <View style={styles.content}>
                    <Title style={styles.title}>
                        {title}
                    </Title>

                    {date !== undefined
                        ? (
                            <Text style={styles.subTitle}>
                                {moment(date).format('YYYY')}
                            </Text>
                        )
                        : null
                    }

                    {character !== undefined
                        ? (
                            <Text style={styles.subTitle}>
                                {character}
                            </Text>
                        )
                        : null
                    }
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
        flexDirection: 'column'
    },
    content: {
        flexDirection: 'column',
        maxWidth: 100
    },
    title: {
        color: '#fff',
        fontSize: 14,
        maxWidth: 100,
        flexWrap: 'wrap',
        textAlign: 'center',
        marginTop: 5
    },
    subTitle: {
        color: '#737373',
        fontSize: 14,
        flexWrap: 'wrap',
        textAlign: 'center',
        marginTop: 3
    },
    image: {
        flex: 1,
        width: 100,
        height: 130,
        borderWidth: 1,
        borderColor: '#fff',
        resizeMode: 'contain'
    }
})
