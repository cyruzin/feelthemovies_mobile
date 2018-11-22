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
                Hello I'm Cyro Dubeux, the app developer.
                This is an App made by a movie fan for movie fans.
                If you have any suggestions to improve this project,
                please send me an email: xorycx@gmail.com.
            </Text>

            <Text style={styles.text}>
                The Movie DB
            </Text>

            <Text style={styles.body}>
                This product uses the TMDb API but is not
                endorsed or certified by TMDb.
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
        textAlign: 'center'
    },
    body: {
        color: '#737373',
        fontSize: 16,
        margin: 10
    }
})