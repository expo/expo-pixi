import Expo, { Asset } from 'expo';
import ExpoPixi, { PIXI } from 'expo-pixi';
import AssetUtils from 'expo-asset-utils';

export default async context => {
  console.log(!!PIXI.spine);

  // Custom Expo loading spine
  const assets = {
    'dragon.png': require('../../assets/pixi/dragon.png'),
    'dragon2.png': require('../../assets/pixi/dragon2.png'),
  };

  const dragon = await ExpoPixi.spineAsync({
    json: require('../../assets/pixi/dragon.json'),
    atlas: require('../../assets/pixi/dragon.atlas'),
    assetProvider: assets,
  });

  const app = ExpoPixi.application({
    context,
  });

  app.stop();

  dragon.skeleton.setToSetupPose();
  dragon.update(0);
  dragon.autoUpdate = false;

  // create a container for the spine animation and add the animation to it
  var dragonCage = new PIXI.Container();
  dragonCage.addChild(dragon);

  // measure the spine animation and position it inside its container to align it to the origin
  var localRect = dragon.getLocalBounds();
  dragon.position.set(-localRect.x, -localRect.y);

  // now we can scale, position and rotate the container as any other display object
  var scale = Math.min(
    app.renderer.width * 0.7 / dragonCage.width,
    app.renderer.height * 0.7 / dragonCage.height
  );
  dragonCage.scale.set(scale, scale);
  dragonCage.position.set(
    (app.renderer.width - dragonCage.width) * 0.5,
    (app.renderer.height - dragonCage.height) * 0.5
  );

  // add the container to the stage
  app.stage.addChild(dragonCage);

  // once position and scaled, set the animation to play
  dragon.state.setAnimation(0, 'flying', true);

  app.start();

  app.ticker.add(function() {
    // update the spine animation, only needed if dragon.autoupdate is set to false
    dragon.update(0.01666666666667); // HARDCODED FRAMERATE!
  });
};
