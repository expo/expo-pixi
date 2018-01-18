import Expo from 'expo';
import * as ExpoPixi from 'expo-pixi';
import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default class App extends Component {
  state = {
    image: null,
    strokeColor: Math.random() * 0xffffff,
    strokeWidth: Math.random() * 30 + 10,
  };

  onChangeAsync = async ({ width, height }) => {
    const options = {
      format: 'png',
      quality: 0.1,
      result: 'file',
      height,
      width,
    };
    const uri = await Expo.takeSnapshotAsync(this.sketch, options);
    this.setState({
      image: { uri },
      strokeWidth: Math.random() * 30 + 10,
      strokeColor: Math.random() * 0xffffff,
    });
  };

  onReady = () => {
    console.log('ready!');
  };

  render() {
    return (
      <View style={styles.container}>
        <ExpoPixi.Sketch
          ref={ref => (this.sketch = ref)}
          style={styles.sketch}
          strokeColor={this.state.strokeColor}
          strokeWidth={this.state.strokeWidth}
          strokeAlpha={1}
          onChange={this.onChangeAsync}
          onReady={this.onReady}
        />
        <Image style={styles.image} source={this.state.image} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sketch: {
    height: '50%',
  },
  image: {
    height: '50%',
    backgroundColor: '#E44262',
  },
});
