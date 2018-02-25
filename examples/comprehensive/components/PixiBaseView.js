import Expo from 'expo';
import React from 'react';
import { PixelRatio, View } from 'react-native';

import TouchableView from './TouchableView';

const scale = PixelRatio.get();
function scaled({ x, y }) {
  return { x: x * scale, y: y * scale };
}
export default ({ app }) => (
  <TouchableView
    id="pixi-view"
    style={{ flex: 1 }}
    onTouchesBegan={({ locationX: x, locationY: y }) => this.began && this.began(scaled({ x, y }))}
    onTouchesMoved={({ locationX: x, locationY: y }) => this.moved && this.moved(scaled({ x, y }))}
    onTouchesEnded={({ locationX: x, locationY: y }) => this.ended && this.ended(scaled({ x, y }))}
    onTouchesCancelled={({ locationX: x, locationY: y }) =>
      this.cancelled ? this.cancelled(scaled({ x, y })) : this.ended && this.ended(scaled({ x, y }))
    }>
    <View style={{ flex: 1 }}>
      <Expo.GLView
        style={{ flex: 1 }}
        onContextCreate={async context => {
          const events = (await app(context)) || {};
          const { began, moved, ended, cancelled } = events;
          this.began = began;
          this.moved = moved;
          this.ended = ended;
          this.cancelled = cancelled;
        }}
      />
    </View>
  </TouchableView>
);
