# expo-pixi

[Pixi.js V4](https://pixijs.download/v4.8.9/docs/) for Expo.

## Installation

```bash
$ npm install @Bartozzz/expo-pixi
```

```bash
$ yarn add @Bartozzz/expo-pixi
```

Additionally, you'll need to install the following dependencies:

```bash
$ expo install expo-gl expo-asset
```

## Usage

```ts
// ✅
import { PIXI } from "expo-pixi";

// ❌
import * as PIXI from "pixi.js";
```

Now you can create a new `Application` the way you would on the web, but be sure to pass in a `WebGLRenderingContext` and pass all the configuration options in the first argument:

```ts
// ✅
const app = new PIXI.Application({ width, height, context });

// ❌
const app = new PIXI.application(width, height);
```

Finally, because of the way React Native currently works you must load in assets asynchronously.

```ts
// ✅
const texture = await PIXI.Texture.from(expoAsset);
const texture = await PIXI.Texture.from(require("../assets/monster.png"));
const texture = await PIXI.Texture.from("https://cdn.example.com/monster.png");

// ✅
const sprite = await PIXI.Sprite.from(texture);
const sprite = await PIXI.Sprite.from(expoAsset);
const sprite = await PIXI.Sprite.from(require("../assets/monster.png"));
const sprite = await PIXI.Sprite.from("https://cdn.example.com/monster.png");
```

## Example

You can find plenty of examples in the `example/` application. A minimal working example is:

```js
import { GLView } from "expo-gl";
import { PIXI } from "@Bartozzz/expo-pixi";

export function App() {
  return (
    <Expo.GLView
      style={{ flex: 1 }}
      onContextCreate={async (context) => {
        const app = new PIXI.Application({ context });
        const sprite = PIXI.Sprite.from(require("../assets/monster.png"));

        app.stage.addChild(sprite);
      }}
    />
  );
}
```
