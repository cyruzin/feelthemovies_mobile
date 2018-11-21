import React, { Component } from 'react'
import { StatusBar, View } from 'react-native'
import Routes from './src/config/routes'
import TabBar from './src/components/TabBar'

export default class App extends Component {

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor="#0f0e0e"
          barStyle="light-content"
        />
        <Routes />
        <View>
          <TabBar />
        </View>
      </View>
    )
  }
}
