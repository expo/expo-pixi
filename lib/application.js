// @flow
import PIXI from './Pixi';

/*
    A helper function to create a `PIXI.Application` from a WebGL context.
    EXGL knows to end a frame when the function: `endFrameEXP` is called on the GL context.

    `context` is the only required prop.
*/
function application({
  width,
  height,
  scale,
  backgroundColor,
  context,
  ...props
}): PIXI.Application {
  // Shim stencil buffer attribute
  const getAttributes = context.getContextAttributes || (() => ({}));
  context.getContextAttributes = () => {
    const contextAttributes = getAttributes();
    return {
      ...contextAttributes,
      stencil: true,
    };
  };

  const resolution = scale || 1; //PixelRatio.get();
  const app = new PIXI.Application({
    context,
    resolution,
    width: width || context.drawingBufferWidth / resolution,
    height: height || context.drawingBufferHeight / resolution,
    backgroundColor,
    ...props,
  });
  app.ticker.add(() => context.endFrameEXP());
  return app;
}
export default application;
