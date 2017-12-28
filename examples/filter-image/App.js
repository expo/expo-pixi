import Expo from 'expo';
import * as ExpoPixi from 'expo-pixi';
import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';

const filter = new PIXI.filters.ColorMatrixFilter();
filter.negative();

export default class App extends Component {
  render() {
    return (
      <ExpoPixi.FilterImage
        source={require('./assets/kylie.jpg')}
        resizeMode={'contain'}
        filters={[filter]}
        style={styles.image}
      />
    );
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});
