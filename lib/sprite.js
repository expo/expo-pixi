// @flow
import PIXI from './Pixi';
import texture from './texture';

type Asset = {
  localUri: string,
  width: number,
  height: number,
};
function sprite(asset: Asset): PIXI.Sprite {
  const tex = texture(asset);
  const sprite = PIXI.Sprite.from(tex);
  return sprite;
}
export default sprite;
