
# expo-pixi

Tools to use [Pixi.js](http://www.pixijs.com/) in Expo!

To get started: `yarn add expo-pixi` in your Expo project and import it with
`import ExpoPixi from 'expo-pixi';`.

## Functions

### `ExpoPixi.application(props): PIXI.Application`

A helper function to create a `PIXI.Application` from a WebGL context.
EXGL knows to end a frame when the function: `endFrameEXP` is called on the GL context.

**`context` is the only required prop.**

[Learn more about PIXI.Application props](http://pixijs.download/dev/docs/PIXI.Application.html)

### `ExpoPixi.spriteAsync(resource: any): Promise`

a helper function to resolve the asset passed in.
`spriteAsync` accepts: - localUri: string | ex: "file://some/path/image.png" - static resource: number | ex: require('./image.png') - remote url: string | ex: "https://www.something.com/image.png" - asset-library: string (iOS `CameraRoll`) | ex: "asset-library://some/path/image.png" - Expo Asset: Expo.Asset | learn more: https://docs.expo.io/versions/latest/guides/assets.html

-----

You cannot send in relative string paths as Metro Bundler looks for static resources.

### `ExpoPixi.sprite({ localUri: string, width: number, height: number }): PIXI.Sprite`

Pixi.js does a type check so we wrap our asset in a `HTMLImageElement` shim.


## Example

**[Snack](https://snack.expo.io/@bacon/base-pixi.js)**

```js
import React from 'react';
import Expo from 'expo';
import ExpoPixi from 'expo-pixi';

export default () => (
  <Expo.GLView
    style={{ flex: 1 }}
    onContextCreate={async context => {
      const app = ExpoPixi.application({ context });
      const sprite = await ExpoPixi.spriteAsync(
        'https://www.celebheights.com/pr1/michael-c-hall.jpg',
      );
      app.stage.addChild(sprite);
    }}
  />
);
```

[![NPM](https://nodei.co/npm/expo-pixi.png)](https://nodei.co/npm/expo-pixi/)
