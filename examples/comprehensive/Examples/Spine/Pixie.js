import ExpoPixi from 'expo-pixi';

export default async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  app.stop();

  var postition = 0,
    background,
    background2,
    foreground,
    foreground2;

  app.stage.interactive = true;

  app.ticker.add(function() {
    postition += 10;

    background.x = -(postition * 0.6);
    background.x %= 1286 * 2;
    if (background.x < 0) {
      background.x += 1286 * 2;
    }
    background.x -= 1286;

    background2.x = -(postition * 0.6) + 1286;
    background2.x %= 1286 * 2;
    if (background2.x < 0) {
      background2.x += 1286 * 2;
    }
    background2.x -= 1286;

    foreground.x = -postition;
    foreground.x %= 1286 * 2;
    if (foreground.x < 0) {
      foreground.x += 1286 * 2;
    }
    foreground.x -= 1286;

    foreground2.x = -postition + 1286;
    foreground2.x %= 1286 * 2;
    if (foreground2.x < 0) {
      foreground2.x += 1286 * 2;
    }
    foreground2.x -= 1286;
  });

  background = await ExpoPixi.spriteAsync(require('../../assets/pixi/iP4_BGtile.jpg'));
  background2 = await ExpoPixi.spriteAsync(require('../../assets/pixi/iP4_BGtile.jpg'));
  foreground = await ExpoPixi.spriteAsync(require('../../assets/pixi/iP4_ground.png'));
  foreground2 = await ExpoPixi.spriteAsync(require('../../assets/pixi/iP4_ground.png'));

  foreground.y = foreground2.y = 640 - foreground2.height;

  app.stage.addChild(background, background2, foreground, foreground2);

  const pixie = await ExpoPixi.spineAsync({
    json: require('../../assets/pixi/Pixie.json'),
    atlas: require('../../assets/pixi/Pixie.atlas'),
    assetProvider: {
      'Pixie.png': require('../../assets/pixi/Pixie.png'),
    },
  });

  var scale = 0.3;

  pixie.x = 1024 / 3;
  pixie.y = 500;

  pixie.scale.x = pixie.scale.y = scale;

  app.stage.addChild(pixie);

  pixie.stateData.setMix('running', 'jump', 0.2);
  pixie.stateData.setMix('jump', 'running', 0.4);

  pixie.state.setAnimation(0, 'running', true);

  global.document.addEventListener('touchstart', function() {
    pixie.state.setAnimation(0, 'jump', false);
    pixie.state.addAnimation(0, 'running', true, 0);
  });

  app.start();
};
