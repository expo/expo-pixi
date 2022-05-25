import { PixelRatio } from "react-native";

import * as filters from "pixi-filters";
import * as PIXIInstance from "pixi.js";

// Override PIXI.Application to automatically compute resolution to be in sync
// with PixiExpo:
// https://pixijs.download/v4.8.9/docs/PIXI.Application.html
class PIXIWebApplication extends PIXIInstance.Application {
  constructor({ resolution, ...props }: PIXIInstance.ApplicationOptions) {
    const targetResolution = resolution ?? PixelRatio.get();

    super({
      resolution: targetResolution,
      ...props,
    });
  }
}

export const PIXI = {
  ...PIXIInstance,
  filters,
  Application: PIXIWebApplication,
};
