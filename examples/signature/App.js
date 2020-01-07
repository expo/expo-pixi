import * as ExpoPixi from 'expo-pixi';
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';

export default function App() {
  let sketch = null;

  onReady = () => {
    console.log('ready!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <View style={styles.sketchContainer}>
          <ExpoPixi.Signature
            ref={ref => (sketch = ref)}
            style={styles.sketch}
            strokeColor={'blue'}
            strokeAlpha={1}
            onReady={onReady}
          />
        </View>
      </View>
      <Button
        color={'blue'}
        title="undo"
        style={styles.button}
        onPress={() => {
          sketch.undo();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sketch: {
    flex: 1,
  },
  sketchContainer: {
    height: '100%',
  },
  image: {
    flex: 1,
  },
  label: {
    width: '100%',
    padding: 5,
    alignItems: 'center',
  },
  button: {
    // position: 'absolute',
    // bottom: 8,
    // left: 8,
    zIndex: 1,
    padding: 12,
    minWidth: 56,
    minHeight: 48,
  },
});
