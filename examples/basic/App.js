import React from 'react';
import { GLView } from 'expo-gl';
import ExpoPIXI, { PIXI } from 'expo-pixi';
import { Asset } from 'expo-asset';
import { resolveAsync } from 'expo-asset-utils';

export default () => (
  <GLView
    style={{ flex: 1 }}
    onContextCreate={async context => {
      const app = new PIXI.Application({ context });

      // const texture = await PIXI.Texture.fromExpoAsync('http://i.imgur.com/uwrbErh.png');
      // const texture = await PIXI.Texture.from('http://i.imgur.com/uwrbErh.png');
      // const sprite = await PIXI.Sprite.from('http://i.imgur.com/uwrbErh.png');
      const sprite = await PIXI.Sprite.fromExpoAsync('http://i.imgur.com/uwrbErh.png');

      app.stage.addChild(sprite);
    }}
  />
);
