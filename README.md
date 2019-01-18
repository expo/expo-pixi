# expo-pixi

Tools to use [Pixi.js](http://www.pixijs.com/) in Expo!

To get started: `yarn add expo-pixi` in your Expo project and import it with
`import ExpoPixi from 'expo-pixi';`.


## Side-Effects

To use Pixi.js with Expo & React Native you will want to import a modified version of Pixi.js like so:

```js

// ✅
import { PIXI } from 'expo-pixi';

// ❌
import * as PIXI from 'pixi.js';

```

Now you can create a new Application the way you would on the web, but be sure to pass in a `WebGLRenderingContext`.

```js

// ✅
const app = new PIXI.Application({ context });

// ❌
const app = ExpoPIXI.application({ context });

```

Finally, because of the way React Native currently works you must load in assets asynchronously.

```js

/*
 * Accepts: 
 * - Expo.Asset: import { Asset } from 'expo-asset'; Asset.fromModule( ... );
 * - URL (with file extension): 'http://i.imgur.com/uwrbErh.png'
 * - Static Resource: require('./icon.png')
 */

// ✅
const sprite = await PIXI.Sprite.fromExpoAsync('http://i.imgur.com/uwrbErh.png');

// OR 

const texture = await PIXI.Texture.fromExpoAsync('http://i.imgur.com/uwrbErh.png');

// ❌
const sprite = await ExpoPIXI.spriteAsync('http://i.imgur.com/uwrbErh.png');

// OR 

const texture = await ExpoPIXI.textureAsync('http://i.imgur.com/uwrbErh.png');
```

Using web syntax will return a `Promise`, and throw a warning. It's bad practice, but if the asset is loaded already, this will work without throwing a warning.

```js
const sprite = await PIXI.Sprite.from(require('./icon.png'));

// > console.warning(PIXI.Sprite.from(asset: ${typeof asset}) is not supported. Returning a Promise!);

// OR 

const texture = await PIXI.Texture.from(require('./icon.png'));

// > console.warning(PIXI.Texture.from(asset: ${typeof asset}) is not supported. Returning a Promise!);
```

## Functions

### `ExpoPixi.application(props): PIXI.Application`

> Deprecated: Use `new PIXI.Application({ context });`

A helper function to create a `PIXI.Application` from a WebGL context.
EXGL knows to end a frame when the function: `endFrameEXP` is called on the GL context.

**`context` is the only required prop.**

[Learn more about PIXI.Application props](http://pixijs.download/dev/docs/PIXI.Application.html)

### `ExpoPixi.textureAsync(resource: any): Promise`

> Deprecated: Use `PIXI.Texture.fromExpoAsync(resource);`

### `ExpoPixi.spriteAsync(resource: any): Promise`

> Deprecated: Use `PIXI.Sprite.fromExpoAsync(resource);`

a helper function to resolve the asset passed in.
`textureAsync` accepts:

* localUri: string | ex: "file://some/path/image.png"
* static resource: number | ex: require('./image.png')
* remote url: string | ex: "https://www.something.com/image.png"
* asset-library: string (iOS `CameraRoll`) | ex: "asset-library://some/path/image.png"
* Expo Asset: Expo.Asset | learn more: https://docs.expo.io/versions/latest/guides/assets.html

You cannot send in relative string paths as Metro Bundler looks for static resources.

---

### `ExpoPixi.sprite({ localUri: string, width: number, height: number }): PIXI.Sprite`

> Deprecated: Use `PIXI.Sprite.from(resource);`

### `ExpoPixi.texture({ localUri: string, width: number, height: number }): PIXI.Texture`

> Deprecated: Use `PIXI.Texture.from(resource);`

Pixi.js does a type check so we wrap our asset in a `HTMLImageElement` shim.

## `ExpoPixi.Sketch`

A component used for drawing smooth signatures and sketches.

**See the sketch example on how to save the images!**

> Notice: the edges and ends are not rounded as this is not supported in PIXI yet: [Issue](https://github.com/pixijs/pixi.js/issues/1637)

#### Props

| Property    |            Type             | Default  | Description                                     |
| ----------- | :-------------------------: | :------: | ----------------------------------------------- |
| strokeColor |           number            | 0x000000 | Color of the lines                              |
| strokeWidth |           number            |    10    | Weight of the lines                             |
| strokeAlpha |           number            |    1     | Opacity of the lines                            |
| onChange    |     () => PIXI.Renderer     |   null   | Invoked whenever a user is done drawing a line  |
| onReady     | () => WebGLRenderingContext |   null   | Invoked when the GL context is ready to be used |

## `ExpoPixi.FilterImage`

A Image component that uses PIXI.Filter

#### Props

| Property   |            Type            | Default | Description                                                                  |
| ---------- | :------------------------: | :-----: | ---------------------------------------------------------------------------- |
| resizeMode |           string           |  null   | Currently only supports `cover`, and `contain`                               |
| filters    |     Array<PIXI.Filter>     |  null   | Array of filters to apply to the image                                       |
| source     | number, string, Expo.Asset |  null   | Source can be a static resource, image url (not `{uri}`), or an `Expo.Asset` |

## Example

**[Snack](https://snack.expo.io/@bacon/base-pixi.js)**

```js
import React from 'react';
import Expo from 'expo';
import { PIXI } from 'expo-pixi';

export default () => (
  <Expo.GLView
    style={{ flex: 1 }}
    onContextCreate={async context => {
      const app = new PIXI.Application({ context });
      const sprite = await PIXI.Sprite.fromExpoAsync(
        'http://i.imgur.com/uwrbErh.png',
      );
      app.stage.addChild(sprite);
    }}
  />
);
```

[![NPM](https://nodei.co/npm/expo-pixi.png)](https://nodei.co/npm/expo-pixi/)
