import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import { View, Text } from 'react-native'
import { Container } from '../UI'

const Movie = props => {
    return (
        <Container>
            <View style={{
                flex: 1,
                margin: 10,
                marginTop: 20,
                marginLeft: 25
            }}>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 20
                }}>
                    <Icon
                        name='tago' size={20} color='#fff'
                    />
                    <Text style={{
                        color: '#737373',
                        fontSize: 16,
                        marginLeft: 15
                    }}>Now Playing</Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 20
                }}>
                    <Icon
                        name='playcircleo' size={20} color='#fff'
                    />
                    <Text style={{
                        color: '#737373',
                        fontSize: 15,
                        marginLeft: 15
                    }}>UpComing</Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 20
                }}>
                    <Icon
                        name='search1' size={20} color='#fff'
                    />
                    <Text style={{
                        color: '#737373',
                        fontSize: 15,
                        marginLeft: 15
                    }}>Recommendation Search</Text>
                </View>

            </View>
        </Container>
    )
}

export default Movie