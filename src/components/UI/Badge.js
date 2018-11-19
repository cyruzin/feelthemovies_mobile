import React from 'react'
import { View, StyleSheet } from 'react-native'

export default props => (
    <View style={[styles.box, props.style]}>
        {props.children}
    </View>
)

const styles = StyleSheet.create({
    box: {
        backgroundColor: '#0093cb',
        padding: 5
    }
})