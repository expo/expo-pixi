import Expo from 'expo';
import * as ExpoPixi from 'expo-pixi';
import React, { Component } from 'react';
import { Image, Platform, AppState, StyleSheet, View } from 'react-native';

const isAndroid = Platform.OS === 'android';
function uuidv4() {
  //https://stackoverflow.com/a/2117523/4047926
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default class App extends Component {
  state = {
    image: null,
    strokeColor: Math.random() * 0xffffff,
    strokeWidth: Math.random() * 30 + 10,
    lines: [
      {
        points: [{ x: 300, y: 300 }, { x: 600, y: 300 }, { x: 450, y: 600 }, { x: 300, y: 300 }],
        color: 0xff00ff,
        alpha: 1,
        width: 10,
      },
    ],
    appState: AppState.currentState,
  };

  handleAppStateChangeAsync = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if (isAndroid && this.sketch) {
        this.setState({ appState: nextAppState, id: uuidv4(), lines: this.sketch.lines });
        return;
      }
    }
    this.setState({ appState: nextAppState });
  };

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChangeAsync);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChangeAsync);
  }

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
          initialLines={this.state.lines}
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
