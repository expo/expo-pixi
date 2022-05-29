import "@expo/browser-polyfill";

import { Asset } from "expo-asset";
import { ExpoWebGLRenderingContext } from "expo-gl";
import * as filters from "pixi-filters";
import * as PIXIInstance from "pixi.js";
import { PixelRatio } from "react-native";

interface ApplicationOptions extends PIXIInstance.ApplicationOptions {
  context: ExpoWebGLRenderingContext;
}

// Override PIXI.Application to accept expo-gl context:
// https://pixijs.download/v4.8.9/docs/PIXI.Application.html
class PIXIApplication extends PIXIInstance.Application {
  constructor({
    context,
    width,
    height,
    resolution,
    ...props
  }: ApplicationOptions) {
    if (!context) {
      throw new Error("PIXI context must be a valid WebGL context.");
    }

    // Shim stencil buffer attribute for PIXI.js check:
    // https://github.com/pixijs/pixijs/blob/359a131eb10485947874b9a48bc2d62c1ee0b1a1/src/core/renderers/webgl/utils/validateContext.js#L6=
    const originalGetContextAttributes =
      context.getContextAttributes || (() => ({}));
    context.getContextAttributes = () => {
      return {
        ...originalGetContextAttributes(),
        stencil: true,
      };
    };

    const targetResolution = resolution ?? PixelRatio.get();
    const targetWidth = width ?? context.drawingBufferWidth / targetResolution;
    const targetHeight =
      height ?? context.drawingBufferHeight / targetResolution;

    super({
      context,
      resolution: targetResolution,
      width: targetWidth,
      height: targetHeight,
      ...props,
    });

    this.ticker.add(() => context.endFrameEXP());
  }
}

class PIXISprite extends PIXIInstance.Sprite {
  static from(asset) {
    if (isAsset(asset)) {
      // @ts-ignore https://github.com/expo/browser-polyfill/blob/master/src/DOM/HTMLImageElement.js#L62=L73
      const image = new global.HTMLImageElement(asset);
      image.onerror = (e) => console.log(`Asset errored ${asset.name}`, e);

      return PIXIInstance.Sprite.from(image);
    } else if (isPath(asset)) {
      return spriteFromAssetAsync(asset);
    } else {
      return PIXIInstance.Sprite.from(asset);
    }
  }
}

class PIXITexture extends PIXIInstance.Texture {
  static from(asset) {
    if (isAsset(asset)) {
      // @ts-ignore https://github.com/expo/browser-polyfill/blob/master/src/DOM/HTMLImageElement.js#L62=L73
      const image = new global.HTMLImageElement(asset);
      image.onerror = (e) => console.log(`Asset errored ${asset.name}`, e);

      return PIXIInstance.Texture.from(image);
    } else if (isPath(asset)) {
      return textureFromAssetAsync(asset);
    } else {
      return PIXIInstance.Texture.from(asset);
    }
  }
}

// It might happen that an asset uri starts with `file:` and not `file://`.
// `expo-gl` expect a texture asset to have the slashes. Enforce the slashes.
function fixFileUri(uri: string) {
  return uri.startsWith("file:") && !uri.startsWith("file://")
    ? "file://" + uri.substring(5)
    : uri;
}

// https://github.com/expo/expo/blob/main/packages/expo-asset/src/ImageAssets.ts
function getImageInfo(url: string): Promise<{
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = reject;
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    img.src = url;
  });
}

function isAsset(resource: unknown): resource is Asset {
  return resource instanceof Asset;
}

function isPath(resource: unknown): resource is string | number {
  return typeof resource === "string" || typeof resource === "number";
}

// https://github.com/expo/expo/issues/10803#issuecomment-731612476
async function textureFromAssetAsync(resource: string | number) {
  const asset = await Asset.fromModule(resource).downloadAsync();
  asset.localUri = fixFileUri(asset.localUri!);
  asset.type = asset.type; // TODO: remove x

  const { width, height } = await getImageInfo(asset.localUri);
  asset.width = width;
  asset.height = height;

  return PIXITexture.from(asset as any);
}

async function spriteFromAssetAsync(resource: string | number) {
  const texture = await textureFromAssetAsync(resource);
  return PIXISprite.from(texture as any);
}

export const PIXI = {
  ...PIXIInstance,
  filters: {
    ...PIXIInstance.filters,
    ...filters,
  },
  Application: PIXIApplication,
  Texture: PIXITexture,
  Sprite: PIXISprite,
};
