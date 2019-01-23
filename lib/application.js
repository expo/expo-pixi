// @flow
import PIXI from './Pixi';
function application(options): PIXI.Application {
  console.warn('ExpoPIXI.application(): is deprecated, use new PIXI.Application(); instead');
  return new PIXI.Application(options);
}
export default application;
