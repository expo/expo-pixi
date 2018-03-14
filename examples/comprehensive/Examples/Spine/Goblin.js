import ExpoPixi from 'expo-pixi';

export default async context => {
  //http://pixijs.io/examples/#/basics/basic.js
  const app = ExpoPixi.application({
    context,
  });

  const goblin = await ExpoPixi.spineAsync({
    json: require('../../assets/pixi/goblins.json'),
    atlas: require('../../assets/pixi/goblins.atlas'),
    assetProvider: {
      'goblins.png': require('../../assets/pixi/goblins.png'),
    },
  });

  // load spine data
  app.stage.interactive = true;
  app.stage.buttonMode = true;

  // set current skin
  goblin.skeleton.setSkinByName('goblin');
  goblin.skeleton.setSlotsToSetupPose();

  // set the position
  goblin.x = 400;
  goblin.y = 600;

  goblin.scale.set(1.5);

  // play animation
  goblin.state.setAnimation(0, 'walk', true);

  app.stage.addChild(goblin);

  global.document.addEventListener('touchstart', function() {
    // change current skin
    var currentSkinName = goblin.skeleton.skin.name;
    var newSkinName = currentSkinName === 'goblin' ? 'goblingirl' : 'goblin';
    goblin.skeleton.setSkinByName(newSkinName);
    goblin.skeleton.setSlotsToSetupPose();
  });
};
