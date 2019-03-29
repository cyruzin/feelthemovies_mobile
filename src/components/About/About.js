import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Container, Title, Text } from '../UI'

const About = () => (
    <Container>
        <View style={styles.content}>
            <Title style={styles.text}>
                Feel the Movies v4.1.19
            </Title>

            <Text style={styles.body}>
                Hello I'm Cyro Dubeux, the app developer.
                This is an App made by a movie fan for movie fans.
                If you have any suggestions to improve this project,
                please send me an email: xorycx@gmail.com.
            </Text>

            <Title style={styles.text}>
                The Movie DB
            </Title>

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
        fontSize: 20,
        textAlign: 'center',
        marginTop: 20
    },
    body: {
        color: '#737373',
        fontSize: 18,
        margin: 10
    }
})