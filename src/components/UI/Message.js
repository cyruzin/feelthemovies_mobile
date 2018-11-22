import React from 'react'
import { Text, StyleSheet } from 'react-native'

const Message = props => (
    <Text style={styles.text}>
        {props.text}
    </Text>
)

const styles = StyleSheet.create({
    text: {
        color: '#737373',
        fontSize: 18,
        margin: 10,
        textAlign: 'center'
    }
})

export default Message
