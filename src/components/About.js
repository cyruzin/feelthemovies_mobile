import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Container } from './UI'

const About = () => (
    <Container>
        <View style={styles.content}>
            <Text style={styles.text}>
                Feel the Movies v4.0
            </Text>

            <Text style={styles.body}>
                Excepteur fugiat veniam sit sit in reprehenderit deserunt laboris amet eu tempor ea irure aliquip. Officia cillum veniam anim non quis velit minim deserunt ad veniam eu officia. Do consequat excepteur laborum voluptate laboris aute in. Dolore et occaecat reprehenderit pariatur ipsum est exercitation nisi deserunt nulla velit. Aliqua proident id magna fugiat laborum pariatur nisi velit labore. Sit sint aliqua anim veniam elit. Eu laborum consequat Lorem sunt irure sit esse qui laborum exercitation pariatur elit voluptate.
            </Text>
        </View>
    </Container>
)

export default About

const styles = StyleSheet.create({
    content: {
        flex: 1,
        margin: 10
    },
    text: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    body: {
        color: '#737373',
        fontSize: 16,
        margin: 10
    }
})