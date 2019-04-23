import { uriAsync } from 'expo-asset-utils';
import { readAsStringAsync } from 'expo-file-system';
import PIXI from './Pixi';

function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  );
}

function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

async function jsonFromResourceAsync(resource) {
  const jsonUrl = await uriAsync(resource);
  const jsonString = await readAsStringAsync(jsonUrl);
  return JSON.parse(jsonString);
}

async function spineAsync({ json, atlas, assetProvider }) {
  // If spine doesn't exist in the global instance of PIXI, import it!
  if (!PIXI.spine) {
    require('pixi-spine');
    // console.error('loadSpineAsync: please import `pixi-spine`');
  }
  const { Spine, core } = PIXI.spine;
  const { TextureAtlas, AtlasAttachmentLoader, SkeletonJson } = core;

  // Parse json - it's a mess because sometimes json can be loaded as a resource, in that case we want to download and parse it.
  let _json = null;
  if (json === null) {
    console.error(
      'loadSpineAsync: Please provide a valid resource for the `json` prop'
    );
    return null;
  } else {
    if (typeof json === 'number') {
      _json = await jsonFromResourceAsync(json);
    } else if (typeof json === 'object') {
      if (json.bones) {
        _json = json;
      } else {
        _json = await jsonFromResourceAsync(json);
      }
    }
  }
  // Downlaod the atlas file
  const atlasUrl = await uriAsync(atlas);
  const _atlas = await readAsStringAsync(atlasUrl);

  if (!_json || typeof _atlas !== 'string') {
    console.error(
      'loadSpine: Invalid props. Please provide: `{ json: Object, atlas: string, assetProvider: Function }`'
    );
  }

  const customAssetProvider = async (line, callback) => {
    const getAsset = async () => {
      if (isFunction(assetProvider)) {
        return new Promise(async res => {
          const resource = await assetProvider(line, res);
          if (resource) {
            res(resource);
          }
        });
      } else if (isObject(assetProvider)) {
        if (line in assetProvider) {
          return assetProvider[line];
        } else {
          console.error(
            "loadSpine: object `assetProvider` doesn't contain key",
            line
          );
        }
      } else {
        console.error(
          'loadSpine: prop `assetProvider` must be a function: (path: string, loaderFunction: (tex: PIXI.BaseTexture) => any) => any, callback?: (obj: TextureAtlas) => any'
        );
      }
    };

    const asset = await getAsset();
    if (asset) {
      if (asset instanceof PIXI.BaseTexture) {
        callback(asset || asset.baseTexture);
        return;
      } else {
        const texture = await PIXI.Texture.fromExpoAsync(asset);
        if (texture) {
          callback(texture.baseTexture || texture);
          return;
        } else {
          console.error('loadSpine: invalid texture provided for', line);
        }
      }
    }

    callback(null);
  };

  const spineAtlas = await new Promise(
    res => new TextureAtlas(_atlas, customAssetProvider, res)
  );
  const atlasAttachment = new AtlasAttachmentLoader(spineAtlas);
  const spineJsonParser = new SkeletonJson(atlasAttachment);
  const spineData = spineJsonParser.readSkeletonData(_json);
  // Create spine instance
  return new Spine(spineData);
}

export default spineAsync;
