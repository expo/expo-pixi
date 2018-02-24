import AssetUtils from 'expo-asset-utils';

import sprite from './sprite';

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

async function spriteAsync(resource) {
  const asset = await AssetUtils.resolveAsync(resource);
  return sprite(asset);
}
export default spriteAsync;
