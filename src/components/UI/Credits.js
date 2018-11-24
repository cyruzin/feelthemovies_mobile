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
import { Title, Text } from '.'

export default props => (
    <TouchableWithoutFeedback
        onPress={() =>
            routeFix(props.route, {
                id: props.id,
                type: props.type
            })}>

        <View style={styles.container}>
            <View>
                <Image
                    style={styles.image}
                    source={{
                        uri: `${imgPath.W300}${props.image}`
                    }}
                />
            </View>
            <View style={styles.content}>
                <Title style={styles.title}>
                    {props.title}
                </Title>

                {props.date !== undefined ?
                    <Text style={styles.subTile}>
                        {moment(props.date).format('YYYY')}
                    </Text>
                    :
                    null
                }

                {props.character !== undefined ?
                    <Text style={styles.subTile}>
                        {props.character}
                    </Text>
                    :
                    null
                }
            </View>
        </View>

    </TouchableWithoutFeedback>
)

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
        fontSize: 12,
        maxWidth: 100,
        flexWrap: 'wrap',
        textAlign: 'center',
        marginTop: 5
    },
    subTile: {
        color: '#737373',
        fontSize: 12,
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