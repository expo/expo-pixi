import ExpoPixi, { PIXI } from 'expo-pixi';

export default async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  const bg = await ExpoPixi.spriteAsync(require('../../assets/pixi/depth_blur_BG.png'));
  bg.width = app.renderer.width;
  bg.height = app.renderer.height;
  app.stage.addChild(bg);

  const littleDudes = await ExpoPixi.spriteAsync(require('../../assets/pixi/depth_blur_dudes.png'));
  littleDudes.x = app.renderer.width / 2 - 315;
  littleDudes.y = 200;
  app.stage.addChild(littleDudes);

  const littleRobot = await ExpoPixi.spriteAsync(require('../../assets/pixi/depth_blur_moby.png'));
  littleRobot.x = app.renderer.width / 2 - 200;
  littleRobot.y = 100;
  app.stage.addChild(littleRobot);

  const blurFilter1 = new PIXI.filters.BlurFilter();
  const blurFilter2 = new PIXI.filters.BlurFilter();

  littleDudes.filters = [blurFilter1];
  littleRobot.filters = [blurFilter2];

  let count = 0;

  app.ticker.add(function() {
    count += 0.005;

    const blurAmount = Math.cos(count);
    const blurAmount2 = Math.sin(count);

    blurFilter1.blur = 20 * blurAmount;
    blurFilter2.blur = 20 * blurAmount2;
  });
};
