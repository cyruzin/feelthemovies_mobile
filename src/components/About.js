import React from 'react'
import { Text, View } from 'react-native'
import { Container } from './UI'

const About = () => (
    <Container>
        <View style={{
            flex: 1,
            margin: 10
        }}>
            <Text style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center'
            }}>
                Feel the Movies v4.0
        </Text>
        </View>
    </Container>
)

export default About