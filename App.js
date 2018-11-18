import React, { Component } from 'react'
import { StatusBar, View } from 'react-native'
import Routes, { TabBar } from './src/config/routes'

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
