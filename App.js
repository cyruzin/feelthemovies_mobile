import React, { Component } from 'react'
import {
  StatusBar,
  View,
  StyleSheet
} from 'react-native'
import Routes from './src/config/routes'
import TabBar from './src/components/TabBar'

export default class App extends Component {

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#0f0e0e"
          barStyle="light-content"
        />
        <Routes />
        <TabBar />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  }
})