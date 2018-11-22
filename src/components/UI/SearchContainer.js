import React from 'react'
import { View, StyleSheet } from 'react-native'

export default props => (
    <View style={styles.container}>
        {props.children}
    </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#0f0e0e'
    },
})