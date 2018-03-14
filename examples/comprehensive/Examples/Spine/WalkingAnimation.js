import ExpoPixi from 'expo-pixi';

export default async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  app.stage.interactive = true;

  // create a spine boy
  const spineBoy = await ExpoPixi.spineAsync({
    json: require('../../assets/pixi/spineboy.json'),
    atlas: require('../../assets/pixi/spineboy.atlas'),
    assetProvider: {
      'spineboy.png': require('../../assets/pixi/spineboy.png'),
    },
  });

  // set the position
  spineBoy.x = app.renderer.width / 2;
  spineBoy.y = app.renderer.height;

  spineBoy.scale.set(1.5);

  // set up the mixes!
  spineBoy.stateData.setMix('walk', 'jump', 0.2);
  spineBoy.stateData.setMix('jump', 'walk', 0.4);

  // play animation
  spineBoy.state.setAnimation(0, 'walk', true);

  app.stage.addChild(spineBoy);

  global.document.addEventListener('touchstart', function() {
    spineBoy.state.setAnimation(0, 'jump', false);
    spineBoy.state.addAnimation(0, 'walk', true, 0);
  });
};
