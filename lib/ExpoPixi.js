// @flow
import { HTMLImageElement } from './dom';
import * as PIXI from 'pixi.js'; // 4.6.2
import resolveAsset from './resolveAsset';
import { PixelRatio } from 'react-native';

/*
    A helper function to create a `PIXI.Application` from a WebGL context.
    EXGL knows to end a frame when the function: `endFrameEXP` is called on the GL context.

    `context` is the only required prop.
*/
export function application({
  width,
  height,
  scale,
  backgroundColor,
  context,
  ...props
}): PIXI.Application {
  const resolution = scale || PixelRatio.get();
  const app = new PIXI.Application({
    context,
    resolution,
    width: width || context.drawingBufferWidth / resolution,
    height: height || context.drawingBufferHeight / resolution,
    backgroundColor: backgroundColor || 0x1099bb,
    ...props,
  });
  app.ticker.add(() => context.endFrameEXP());
  return app;
}

/*
    a helper function to resolve the asset passed in.
    `spriteAsync` accepts: 
    - localUri: string | ex: "file://some/path/image.png"
    - static resource: number | ex: require('./image.png')
    - remote url: string | ex: "https://www.something.com/image.png"
    - asset-library: string (iOS `CameraRoll`) | ex: "asset-library://some/path/image.png"
    - Expo Asset: Expo.Asset | learn more: https://docs.expo.io/versions/latest/guides/assets.html

    -----

    You cannot send in relative string paths as Metro Bundler looks for static resources.

*/
export async function spriteAsync(resource) {
  let urls = await resolveAsset(resource);
  if (!urls) {
    console.error(
      `ExpoPixi.spriteAsync: Cannot parse undefined assets. Please pass valid resources for: ${resource}.`
    );
    return;
  }
  const asset = urls[0];
  return sprite(asset);
}

type Asset = {
  localUri: string,
  width: number,
  height: number,
};
/*
    Pixi.js does a type check so we wrap our asset in a `HTMLImageElement` shim.
*/
export function sprite(asset: Asset): PIXI.Sprite {
  if (!asset.localUri || !asset.localUri.toLowerCase().startsWith('file://')) {
    console.error(
      `ExpoPixi.sprite: Please pass valid localUri! ${asset.localUri} doesn't start with "file://"`
    );
    return;
  }
  const image = new HTMLImageElement(asset);
  const sprite = PIXI.Sprite.from(image);
  return sprite;
}
