import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { GLView } from "expo-gl";
import { PIXI } from "expo-pixi";
import * as React from "react";
import { View, Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const Drawer = createDrawerNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Drawer.Navigator useLegacyImplementation>
        <Drawer.Group>
          <Drawer.Screen name="Container" component={ContainerScreen} />
          <Drawer.Screen
            name="TransparentBackground"
            component={TransparentBackgroundScreen}
          />
          <Drawer.Screen name="Tinting" component={TintingScreen} />
          <Drawer.Screen
            name="ParticleContainer"
            component={ParticleContainerScreen}
          />
          <Drawer.Screen name="BlendModes" component={BlendModesScreen} />
        </Drawer.Group>

        <Drawer.Group>
          <Drawer.Screen name="StarWarp" component={StarWarpScreen} />
        </Drawer.Group>

        <Drawer.Group>
          <Drawer.Screen name="TilingSprite" component={TilingSpriteScreen} />
        </Drawer.Group>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

function ContainerScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <GLView
        style={{ width, height }}
        onContextCreate={async (context) => {
          const app = new PIXI.Application({
            context,
            width,
            height,
            backgroundColor: 0x1099bb,
          });

          const container = new PIXI.Container();

          app.stage.addChild(container);

          // Create a new texture
          const texture = await PIXI.Texture.from(
            require("../assets/bunny.png")
          );

          // Create a 5x5 grid of bunnies
          for (let i = 0; i < 25; i++) {
            const bunny = await PIXI.Sprite.from(texture);
            bunny.anchor.set(0.5);
            bunny.x = (i % 5) * 40;
            bunny.y = Math.floor(i / 5) * 40;
            container.addChild(bunny);
          }

          // Move container to the center∂
          container.x = app.screen.width / 2;
          container.y = app.screen.height / 2;

          // Center bunny sprite in local container coordinates
          container.pivot.x = container.width / 2;
          container.pivot.y = container.height / 2;

          // Listen for animate update
          app.ticker.add((delta) => {
            // rotate the container!
            // use delta to create frame-independent transform
            container.rotation -= 0.01 * delta;
          });
        }}
      />
    </View>
  );
}

function TransparentBackgroundScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <GLView
        style={{ width, height }}
        onContextCreate={async (context) => {
          const app = new PIXI.Application({
            context,
            width,
            height,
            transparent: true,
          });

          // create a new Sprite from an image path.
          const bunny = await PIXI.Sprite.from(require("../assets/bunny.png"));

          // center the sprite's anchor point
          bunny.anchor.set(0.5);

          // move the sprite to the center of the screen
          bunny.x = app.screen.width / 2;
          bunny.y = app.screen.height / 2;

          app.stage.addChild(bunny);

          app.ticker.add(function () {
            // just for fun, let's rotate mr rabbit a little
            bunny.rotation += 0.1;
          });
        }}
      />
    </View>
  );
}

function TintingScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <GLView
        style={{ width, height }}
        onContextCreate={async (context) => {
          const app = new PIXI.Application({
            context,
            width,
            height,
          });

          // holder to store the aliens
          const aliens = [];

          const totalDudes = 20;

          for (let i = 0; i < totalDudes; i++) {
            // create a new Sprite that uses the image name that we just generated as its source
            const dude = await PIXI.Sprite.from(
              require("../assets/eggHead.png")
            );

            // set the anchor point so the texture is centerd on the sprite
            dude.anchor.set(0.5);

            // set a random scale for the dude - no point them all being the same size!
            dude.scale.set(0.8 + Math.random() * 0.3);

            // finally lets set the dude to be at a random position..
            dude.x = Math.random() * app.screen.width;
            dude.y = Math.random() * app.screen.height;

            dude.tint = Math.random() * 0xffffff;

            // create some extra properties that will control movement :
            // create a random direction in radians. This is a number between 0 and PI*2 which is the equivalent of 0 - 360 degrees
            dude.direction = Math.random() * Math.PI * 2;

            // this number will be used to modify the direction of the dude over time
            dude.turningSpeed = Math.random() - 0.8;

            // create a random speed for the dude between 0 - 2
            dude.speed = 2 + Math.random() * 2;

            // finally we push the dude into the aliens array so it it can be easily accessed later
            aliens.push(dude);

            app.stage.addChild(dude);
          }

          // create a bounding box for the little dudes
          const dudeBoundsPadding = 100;
          const dudeBounds = new PIXI.Rectangle(
            -dudeBoundsPadding,
            -dudeBoundsPadding,
            app.screen.width + dudeBoundsPadding * 2,
            app.screen.height + dudeBoundsPadding * 2
          );

          app.ticker.add(function () {
            // iterate through the dudes and update their position
            for (let i = 0; i < aliens.length; i++) {
              const dude = aliens[i];
              dude.direction += dude.turningSpeed * 0.01;
              dude.x += Math.sin(dude.direction) * dude.speed;
              dude.y += Math.cos(dude.direction) * dude.speed;
              dude.rotation = -dude.direction - Math.PI / 2;

              // wrap the dudes by testing their bounds...
              if (dude.x < dudeBounds.x) {
                dude.x += dudeBounds.width;
              } else if (dude.x > dudeBounds.x + dudeBounds.width) {
                dude.x -= dudeBounds.width;
              }

              if (dude.y < dudeBounds.y) {
                dude.y += dudeBounds.height;
              } else if (dude.y > dudeBounds.y + dudeBounds.height) {
                dude.y -= dudeBounds.height;
              }
            }
          });
        }}
      />
    </View>
  );
}

function ParticleContainerScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <GLView
        style={{ width, height }}
        onContextCreate={async (context) => {
          const app = new PIXI.Application({
            context,
            width,
            height,
          });

          const totalSprites = 2000;

          const sprites = new PIXI.particles.ParticleContainer(totalSprites, {
            scale: true,
            position: true,
            rotation: true,
            uvs: true,
            alpha: true,
          });
          app.stage.addChild(sprites);

          // create an array to store all the sprites
          const maggots = [];

          // Create a new texture
          const texture = await PIXI.Texture.from(
            require("../assets/maggot_tiny.png")
          );

          for (let i = 0; i < totalSprites; i++) {
            // create a new Sprite
            const dude = PIXI.Sprite.from(texture);

            dude.tint = Math.random() * 0xe8d4cd;

            // set the anchor point so the texture is centerd on the sprite
            dude.anchor.set(0.5);

            // different maggots, different sizes
            dude.scale.set(0.8 + Math.random() * 0.3);

            // scatter them all
            dude.x = Math.random() * app.screen.width;
            dude.y = Math.random() * app.screen.height;

            dude.tint = Math.random() * 0x808080;

            // create a random direction in radians
            dude.direction = Math.random() * Math.PI * 2;

            // this number will be used to modify the direction of the sprite over time
            dude.turningSpeed = Math.random() - 0.8;

            // create a random speed between 0 - 2, and these maggots are slooww
            dude.speed = (2 + Math.random() * 2) * 0.2;

            dude.offset = Math.random() * 100;

            // finally we push the dude into the maggots array so it it can be easily accessed later
            maggots.push(dude);

            sprites.addChild(dude);
          }

          // create a bounding box box for the little maggots
          const dudeBoundsPadding = 100;
          const dudeBounds = new PIXI.Rectangle(
            -dudeBoundsPadding,
            -dudeBoundsPadding,
            app.screen.width + dudeBoundsPadding * 2,
            app.screen.height + dudeBoundsPadding * 2
          );

          let tick = 0;

          app.ticker.add(function () {
            // iterate through the sprites and update their position
            for (let i = 0; i < maggots.length; i++) {
              const dude = maggots[i];
              dude.scale.y = 0.95 + Math.sin(tick + dude.offset) * 0.05;
              dude.direction += dude.turningSpeed * 0.01;
              dude.x += Math.sin(dude.direction) * (dude.speed * dude.scale.y);
              dude.y += Math.cos(dude.direction) * (dude.speed * dude.scale.y);
              dude.rotation = -dude.direction + Math.PI;

              // wrap the maggots
              if (dude.x < dudeBounds.x) {
                dude.x += dudeBounds.width;
              } else if (dude.x > dudeBounds.x + dudeBounds.width) {
                dude.x -= dudeBounds.width;
              }

              if (dude.y < dudeBounds.y) {
                dude.y += dudeBounds.height;
              } else if (dude.y > dudeBounds.y + dudeBounds.height) {
                dude.y -= dudeBounds.height;
              }
            }

            // increment the ticker
            tick += 0.1;
          });
        }}
      />
    </View>
  );
}

function BlendModesScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <GLView
        style={{ width, height }}
        onContextCreate={async (context) => {
          const app = new PIXI.Application({
            context,
            width,
            height,
          });

          // create a new background sprite
          const background = await PIXI.Sprite.from(
            require("../assets/bg_rotate.jpg")
          );
          background.width = app.screen.width;
          background.height = app.screen.height;
          app.stage.addChild(background);

          // create an array to store a reference to the dudes
          const dudeArray = [];

          const totaldudes = 20;

          for (let i = 0; i < totaldudes; i++) {
            // create a new Sprite that uses the image name that we just generated as its source
            const dude = await PIXI.Sprite.from(
              require("../assets/flowerTop.png")
            );

            dude.anchor.set(0.5);

            // set a random scale for the dude
            dude.scale.set(0.8 + Math.random() * 0.3);

            // finally let's set the dude to be at a random position...
            dude.x = Math.floor(Math.random() * app.screen.width);
            dude.y = Math.floor(Math.random() * app.screen.height);

            // The important bit of this example, this is how you change the default blend mode of the sprite
            dude.blendMode = PIXI.BLEND_MODES.ADD;

            // create some extra properties that will control movement
            dude.direction = Math.random() * Math.PI * 2;

            // this number will be used to modify the direction of the dude over time
            dude.turningSpeed = Math.random() - 0.8;

            // create a random speed for the dude between 0 - 2
            dude.speed = 2 + Math.random() * 2;

            // finally we push the dude into the dudeArray so it it can be easily accessed later
            dudeArray.push(dude);

            app.stage.addChild(dude);
          }

          // create a bounding box for the little dudes
          const dudeBoundsPadding = 100;

          const dudeBounds = new PIXI.Rectangle(
            -dudeBoundsPadding,
            -dudeBoundsPadding,
            app.screen.width + dudeBoundsPadding * 2,
            app.screen.height + dudeBoundsPadding * 2
          );

          app.ticker.add(function () {
            // iterate through the dudes and update the positions
            for (let i = 0; i < dudeArray.length; i++) {
              const dude = dudeArray[i];
              dude.direction += dude.turningSpeed * 0.01;
              dude.x += Math.sin(dude.direction) * dude.speed;
              dude.y += Math.cos(dude.direction) * dude.speed;
              dude.rotation = -dude.direction - Math.PI / 2;

              // wrap the dudes by testing their bounds...
              if (dude.x < dudeBounds.x) {
                dude.x += dudeBounds.width;
              } else if (dude.x > dudeBounds.x + dudeBounds.width) {
                dude.x -= dudeBounds.width;
              }

              if (dude.y < dudeBounds.y) {
                dude.y += dudeBounds.height;
              } else if (dude.y > dudeBounds.y + dudeBounds.height) {
                dude.y -= dudeBounds.height;
              }
            }
          });
        }}
      />
    </View>
  );
}

function StarWarpScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <GLView
        style={{ width, height }}
        onContextCreate={async (context) => {
          const app = new PIXI.Application({
            context,
            width,
            height,
          });

          // Get the texture for rope.
          const starTexture = await PIXI.Texture.from(
            require("../assets/star.png")
          );

          const starAmount = 1000;
          let cameraZ = 0;
          const fov = 20;
          const baseSpeed = 0.025;
          let speed = 0;
          let warpSpeed = 0;
          const starStretch = 5;
          const starBaseSize = 0.05;

          // Create the stars
          const stars = [];
          for (let i = 0; i < starAmount; i++) {
            const star = {
              sprite: new PIXI.Sprite(starTexture),
              z: 0,
              x: 0,
              y: 0,
            };
            star.sprite.anchor.x = 0.5;
            star.sprite.anchor.y = 0.7;
            randomizeStar(star, true);
            app.stage.addChild(star.sprite);
            stars.push(star);
          }

          function randomizeStar(star, initial) {
            star.z = initial
              ? Math.random() * 2000
              : cameraZ + Math.random() * 1000 + 2000;

            // Calculate star positions with radial random coordinate so no star hits the camera.
            const deg = Math.random() * Math.PI * 2;
            const distance = Math.random() * 50 + 1;
            star.x = Math.cos(deg) * distance;
            star.y = Math.sin(deg) * distance;
          }

          // Change flight speed every 5 seconds
          setInterval(function () {
            warpSpeed = warpSpeed > 0 ? 0 : 1;
          }, 5000);

          // Listen for animate update
          app.ticker.add(function (delta) {
            // Simple easing. This should be changed to proper easing function when used for real.
            speed += (warpSpeed - speed) / 20;
            cameraZ += delta * 10 * (speed + baseSpeed);
            for (let i = 0; i < starAmount; i++) {
              const star = stars[i];
              if (star.z < cameraZ) randomizeStar(star);

              // Map star 3d position to 2d with really simple projection
              const z = star.z - cameraZ;
              star.sprite.x =
                star.x * (fov / z) * app.renderer.screen.width +
                app.renderer.screen.width / 2;
              star.sprite.y =
                star.y * (fov / z) * app.renderer.screen.width +
                app.renderer.screen.height / 2;

              // Calculate star scale & rotation.
              const dxCenter = star.sprite.x - app.renderer.screen.width / 2;
              const dyCenter = star.sprite.y - app.renderer.screen.height / 2;
              const distanceCenter = Math.sqrt(
                dxCenter * dxCenter + dyCenter + dyCenter
              );
              const distanceScale = Math.max(0, (2000 - z) / 2000);
              star.sprite.scale.x = distanceScale * starBaseSize;
              // Star is looking towards center so that y axis is towards center.
              // Scale the star depending on how fast we are moving, what the stretchfactor is and depending on how far away it is from the center.
              star.sprite.scale.y =
                distanceScale * starBaseSize +
                (distanceScale * speed * starStretch * distanceCenter) /
                  app.renderer.screen.width;
              star.sprite.rotation =
                Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
            }
          });
        }}
      />
    </View>
  );
}

function TilingSpriteScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <GLView
        style={{ width, height }}
        onContextCreate={async (context) => {
          const app = new PIXI.Application({
            context,
            width,
            height,
          });

          // create a texture from an image path
          const texture = await PIXI.Texture.from(require("../assets/p2.jpeg"));

          /* create a tiling sprite ...
           * requires a texture, a width and a height
           * in WebGL the image size should preferably be a power of two
           */
          const tilingSprite = new PIXI.extras.TilingSprite(
            texture,
            app.screen.width,
            app.screen.height
          );
          app.stage.addChild(tilingSprite);

          let count = 0;

          app.ticker.add(function () {
            count += 0.005;

            tilingSprite.tileScale.x = 2 + Math.sin(count);
            tilingSprite.tileScale.y = 2 + Math.cos(count);

            tilingSprite.tilePosition.x += 1;
            tilingSprite.tilePosition.y += 1;
          });
        }}
      />
    </View>
  );
}
