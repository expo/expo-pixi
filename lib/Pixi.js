import '@expo/browser-polyfill';

import * as filters from 'pixi-filters';
import * as PixiInstance from 'pixi.js';

global.PIXI = global.PIXI || PixiInstance;
const PIXI = global.PIXI;
PIXI.filters = { ...(PIXI.filters || {}), ...filters };
export default PIXI;
