import '@expo/browser-polyfill';

import PIXI from './Pixi';

export { default as Signature } from './components/Signature';
export { default as Sketch } from './components/Sketch';
export { default as FilterImage } from './components/FilterImage';
export { default as spineAsync } from './spineAsync';

function deprecated(old, next) {
  console.warn(`expo-pixi: ${old} is deprecated, please use ${next} instead.`);
}

export async function spriteAsync(resource) {
  deprecated('spriteAsync()', 'PIXI.Sprite.fromExpoAsync()');
  return PIXI.Sprite.fromExpoAsync(resource);
}

export async function textureAsync(resource) {
  deprecated('textureAsync()', 'PIXI.Texture.fromExpoAsync()');
  return PIXI.Texture.fromExpoAsync(resource);
}

export async function application(options) {
  deprecated('application()', 'new PIXI.Application()');

  return new PIXI.Application(options);
}

export function texture(asset): PIXI.Texture {
  deprecated('texture()', 'PIXI.Texture.from()');
  return PIXI.Texture.from(asset);
}

export function sprite(asset): PIXI.Sprite {
  deprecated('sprite()', 'PIXI.Sprite.from()');
  return PIXI.Sprite.from(asset);
}

export { PIXI };
