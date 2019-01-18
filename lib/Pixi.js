import '@expo/browser-polyfill';

import * as filters from 'pixi-filters';
import * as PixiInstance from 'pixi.js';

import { resolveAsync } from 'expo-asset-utils';

global.PIXI = global.PIXI || PixiInstance;
let PIXI = global.PIXI;
PIXI.filters = { ...(PIXI.filters || {}), ...filters };

class ExpoPIXIApplication extends PIXI.Application {
  constructor({ width, height, scale, backgroundColor, context, ...props }) {
    // Shim stencil buffer attribute
    const getAttributes = context.getContextAttributes || (() => ({}));
    context.getContextAttributes = () => {
      const contextAttributes = getAttributes();
      return {
        ...contextAttributes,
        stencil: true,
      };
    };

    const resolution = scale || 1; //PixelRatio.get();
    super({
      context,
      resolution,
      width: width || context.drawingBufferWidth / resolution,
      height: height || context.drawingBufferHeight / resolution,
      backgroundColor,
      ...props,
    });
    this.ticker.add(() => context.endFrameEXP());
  }
}

const isAsset = input => {
  return (
    input &&
    typeof input.width === 'number' &&
    typeof input.height === 'number' &&
    typeof input.localUri === 'string'
  );
};

if (!(PIXI.Application instanceof ExpoPIXIApplication)) {
  const { HTMLImageElement } = global;

  const textureFromExpoAsync = async resource => {
    const asset = await resolveAsync(resource);
    return PIXI.Texture.from(asset);
  };

  const spriteFromExpoAsync = async resource => {
    const texture = await textureFromExpoAsync(resource);
    return PIXI.Sprite.from(texture);
  };

  const originalSpriteFrom = PIXI.Sprite.from;
  const originalTextureFrom = PIXI.Texture.from;
  PIXI = {
    ...PIXI,
    Application: ExpoPIXIApplication,
    Texture: {
      ...PIXI.Texture,
      from: (...props) => {
        if (props.length && props[0]) {
          let asset = props[0];
          if (isAsset(asset)) {
            if (asset instanceof HTMLImageElement) {
              return originalTextureFrom(asset);
            } else {
              return originalTextureFrom(new HTMLImageElement(asset));
            }
          } else if (typeof asset === 'string' || typeof asset === 'number') {
            console.warn(
              `PIXI.Texture.from(asset: ${typeof asset}) is not supported. Returning a Promise!`
            );
            return textureFromExpoAsync(asset);
          }
        }
        return originalTextureFrom(...props);
      },
      fromExpoAsync: textureFromExpoAsync,
    },
    Sprite: {
      ...PIXI.Sprite,
      fromExpoAsync: spriteFromExpoAsync,
      from: (...props) => {
        if (props.length && props[0]) {
          let asset = props[0];
          if (isAsset(asset)) {
            const image = new HTMLImageElement(asset);
            return originalSpriteFrom(image);
          } else if (typeof asset === 'string' || typeof asset === 'number') {
            console.warn(
              `PIXI.Sprite.from(asset: ${typeof asset}) is not supported. Returning a Promise!`
            );
            return spriteFromExpoAsync(asset);
          }
        }

        return originalSpriteFrom(...props);
      },
    },
  };
}

export default PIXI;
