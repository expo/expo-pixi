import Expo from 'expo';
import * as ExpoPixi from 'expo-pixi';
import React, { Component } from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';

function filter(filters) {
  const output = new PIXI.filters.ColorMatrixFilter();
  if (Array.isArray(filters)) {
    filters.map(item => {
      if (typeof item === 'string') {
        output[item]();
      } else {
        const { name, props } = item;
        output[name](...props);
      }
    });
  } else {
    return filter([filters]);
  }
  return output;
}

const filters = [
  { name: 'reset' },
  {
    name: 'brightness',
    tools: [{ type: 'number', min: 0, max: 1, standard: 0.3 }],
  },
  {
    name: 'greyscale',
    tools: [{ type: 'number', min: 0, max: 1, standard: 0.6 }],
  },
  { name: 'blackAndWhite' },
  { name: 'hue', tools: [{ type: 'number', min: 0, max: 360, standard: 180 }] },
  {
    name: 'contrast',
    tools: [{ type: 'number', min: 0, max: 1, standard: 0.8 }],
  },
  {
    name: 'saturate',
    tools: [{ type: 'number', min: 0, max: 1, standard: 0.8 }],
  },
  { name: 'desaturate' },
  { name: 'negative' },
  { name: 'sepia' },
  { name: 'technicolor', tools: [{ type: 'boolean', standard: true }] },
  { name: 'polaroid' },
  { name: 'toBGR' },
  { name: 'kodachrome', tools: [{ type: 'boolean', standard: true }] },
  { name: 'browni', tools: [{ type: 'boolean', standard: true }] },
  { name: 'vintage', tools: [{ type: 'boolean', standard: true }] },
  {
    name: 'colorTone',
    tools: [
      { type: 'number', min: 0, max: 1, standard: 0.5 },
      { type: 'number', min: 0, max: 1, standard: 0.5 },
      { type: 'color', standard: 0xff0000 },
      { type: 'color', standard: 0x000011 },
    ],
  },
  { name: 'night', tools: [{ type: 'number', min: 0, max: 1, standard: 0.5 }] },
  {
    name: 'predator',
    tools: [{ type: 'number', min: 0, max: 1, standard: 0.5 }],
  },
  { name: 'lsd' },
].map(({ name, tools }) => {
  return filter({
    name: name,
    props: (tools || []).map(tool => tool.standard),
  });
});
export default class App extends Component {
  state = {
    index: 0,
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            const index = (this.state.index + 1) % filters.length;
            this.setState({
              index,
            });
          }}>
          <ExpoPixi.FilterImage
            source={require('./assets/kylie.jpg')}
            resizeMode={'cover'}
            filters={filters[this.state.index]}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
