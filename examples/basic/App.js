import React from 'react';
import Expo from 'expo';
import ExpoPixi from 'expo-pixi';

export default () => (
  <Expo.GLView
    style={{ flex: 1 }}
    onContextCreate={async context => {
      const app = ExpoPixi.application({ context });
      const sprite = await ExpoPixi.spriteAsync(
        'https://www.celebheights.com/pr1/michael-c-hall.jpg'
      );
      app.stage.addChild(sprite);
    }}
  />
);
