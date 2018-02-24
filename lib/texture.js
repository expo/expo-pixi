// @flow
import PIXI from './Pixi';

type Asset = {
  localUri: string,
  width: number,
  height: number,
};

function texture(asset: Asset): PIXI.Texture {
  if (!asset.localUri || !asset.localUri.toLowerCase().startsWith('file://')) {
    console.error(
      `ExpoPixi.texture: Please pass valid localUri! ${asset.localUri} doesn't start with "file://"`
    );
    return;
  }
  const { HTMLImageElement } = global;
  const image = new HTMLImageElement(asset);
  const texture = PIXI.Texture.from(image);
  return texture;
}
export default texture;
