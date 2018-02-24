import AssetUtils from 'expo-asset-utils';

import texture from './texture';

async function textureAsync(resource) {
  const asset = await AssetUtils.resolveAsync(resource);
  return texture(asset);
}
export default textureAsync;
