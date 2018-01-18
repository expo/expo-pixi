import './dom';
import 'url';
import 'path';
import * as PixiInstance from 'pixi.js'; // 4.6.2
const PIXI = (global.PIXI = global.PIXI || PixiInstance);
import * as filters from 'pixi-filters';
PIXI.filters = { ...(PIXI.filters || {}), ...filters };
export default PIXI;
