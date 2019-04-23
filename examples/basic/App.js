import { GLView } from 'expo';
import { PIXI } from 'expo-pixi';
import React from 'react';

export default () => (
  <GLView
    style={{ flexGrow: 1, flexShrink: 0, flexBasis: 'auto' }}
    onContextCreate={async context => {
      const app = new PIXI.Application({ context });
      // const texture = await PIXI.Texture.fromExpoAsync('http://i.imgur.com/uwrbErh.png');
      // const texture = await PIXI.Texture.from('http://i.imgur.com/uwrbErh.png');
      // const sprite = PIXI.Sprite.from(texture);
      // const sprite = await PIXI.Sprite.from('http://i.imgur.com/uwrbErh.png');
      const sprite = await PIXI.Sprite.fromExpoAsync('http://i.imgur.com/uwrbErh.png');
      app.stage.addChild(sprite);
    }}
  />
);
