import { Platform } from "react-native";

import { PIXI as PIXIWeb } from "./PixiWeb.js";
import { PIXI as PIXIExpo } from "./PixiExpo.js";

export const PIXI = Platform.select({
  web: PIXIWeb,
  default: PIXIExpo,
});
