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

        <Drawer.Group>
          <Drawer.Screen name="Graphics" component={GraphicsScreen} />
          <Drawer.Screen
            name="GraphicsAdvanced"
            component={GraphicsAdvancedScreen}
          />
          <Drawer.Screen
            name="GraphicsDynamic"
            component={GraphicsDynamicScreen}
          />
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

function GraphicsScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <GLView
        style={{ width, height }}
        onContextCreate={async (context) => {
          const app = new PIXI.Application({
            context,
            width,
            height,
            antialias: true,
          });

          const graphics = new PIXI.Graphics();

          // Rectangle
          graphics.beginFill(0xde3249);
          graphics.drawRect(50, 50, 100, 100);
          graphics.endFill();

          // Rectangle + line style 1
          graphics.lineStyle(2, 0xfeeb77, 1);
          graphics.beginFill(0x650a5a);
          graphics.drawRect(200, 50, 100, 100);
          graphics.endFill();

          // Rectangle + line style 2
          graphics.lineStyle(10, 0xffbd01, 1);
          graphics.beginFill(0xc34288);
          graphics.drawRect(350, 50, 100, 100);
          graphics.endFill();

          // Rectangle 2
          graphics.lineStyle(2, 0xffffff, 1);
          graphics.beginFill(0xaa4f08);
          graphics.drawRect(530, 50, 140, 100);
          graphics.endFill();

          // Circle
          graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
          graphics.beginFill(0xde3249, 1);
          graphics.drawCircle(100, 250, 50);
          graphics.endFill();

          // Circle + line style 1
          graphics.lineStyle(2, 0xfeeb77, 1);
          graphics.beginFill(0x650a5a, 1);
          graphics.drawCircle(250, 250, 50);
          graphics.endFill();

          // Circle + line style 2
          graphics.lineStyle(10, 0xffbd01, 1);
          graphics.beginFill(0xc34288, 1);
          graphics.drawCircle(400, 250, 50);
          graphics.endFill();

          // Ellipse + line style 2
          graphics.lineStyle(2, 0xffffff, 1);
          graphics.beginFill(0xaa4f08, 1);
          graphics.drawEllipse(600, 250, 80, 50);
          graphics.endFill();

          // draw a shape
          graphics.beginFill(0xff3300);
          graphics.lineStyle(4, 0xffd900, 1);
          graphics.moveTo(50, 350);
          graphics.lineTo(250, 350);
          graphics.lineTo(100, 400);
          graphics.lineTo(50, 350);
          graphics.endFill();

          // draw a rounded rectangle
          graphics.lineStyle(2, 0xff00ff, 1);
          graphics.beginFill(0x650a5a, 0.25);
          graphics.drawRoundedRect(50, 440, 100, 100, 16);
          graphics.endFill();

          // draw star
          graphics.lineStyle(2, 0xffffff);
          graphics.beginFill(0x35cc5a, 1);
          graphics.drawStar(360, 370, 5, 50);
          graphics.endFill();

          // draw star 2
          graphics.lineStyle(2, 0xffffff);
          graphics.beginFill(0xffcc5a, 1);
          graphics.drawStar(280, 510, 7, 50);
          graphics.endFill();

          // draw star 3
          graphics.lineStyle(4, 0xffffff);
          graphics.beginFill(0x55335a, 1);
          graphics.drawStar(470, 450, 4, 50);
          graphics.endFill();

          // draw polygon
          const path = [600, 370, 700, 460, 780, 420, 730, 570, 590, 520];

          graphics.lineStyle(0);
          graphics.beginFill(0x3500fa, 1);
          graphics.drawPolygon(path);
          graphics.endFill();

          app.stage.addChild(graphics);
        }}
      />
    </View>
  );
}

function GraphicsAdvancedScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <GLView
        style={{ width, height }}
        onContextCreate={async (context) => {
          const app = new PIXI.Application({
            context,
            width,
            height,
            antialias: true,
          });

          const sprite = await PIXI.Sprite.from(
            require("../assets/bg_rotate.jpg")
          );

          // // BEZIER CURVE ////
          // information: https://en.wikipedia.org/wiki/Bézier_curve

          const realPath = new PIXI.Graphics();

          realPath.lineStyle(2, 0xffffff, 1);
          realPath.moveTo(0, 0);
          realPath.lineTo(100, 200);
          realPath.lineTo(200, 200);
          realPath.lineTo(240, 100);

          realPath.position.x = 50;
          realPath.position.y = 50;

          app.stage.addChild(realPath);

          const bezier = new PIXI.Graphics();

          bezier.lineStyle(5, 0xaa0000, 1);
          bezier.bezierCurveTo(100, 200, 200, 200, 240, 100);

          bezier.position.x = 50;
          bezier.position.y = 50;

          app.stage.addChild(bezier);

          // // BEZIER CURVE 2 ////
          const realPath2 = new PIXI.Graphics();

          realPath2.lineStyle(2, 0xffffff, 1);
          realPath2.moveTo(0, 0);
          realPath2.lineTo(0, -100);
          realPath2.lineTo(150, 150);
          realPath2.lineTo(240, 100);

          realPath2.position.x = 320;
          realPath2.position.y = 150;

          app.stage.addChild(realPath2);

          const bezier2 = new PIXI.Graphics();

          bezier2.lineTextureStyle(10, sprite.texture);
          bezier2.bezierCurveTo(0, -100, 150, 150, 240, 100);

          bezier2.position.x = 320;
          bezier2.position.y = 150;

          app.stage.addChild(bezier2);

          // // ARC ////
          const arc = new PIXI.Graphics();

          arc.lineStyle(5, 0xaa00bb, 1);
          arc.arc(600, 100, 50, Math.PI, 2 * Math.PI);

          app.stage.addChild(arc);

          // // ARC 2 ////
          const arc2 = new PIXI.Graphics();

          arc2.lineStyle(6, 0x3333dd, 1);
          arc2.arc(650, 270, 60, 2 * Math.PI, (3 * Math.PI) / 2);

          app.stage.addChild(arc2);

          // // ARC 3 ////
          const arc3 = new PIXI.Graphics();

          arc3.lineTextureStyle(20, sprite.texture);
          arc3.arc(650, 420, 60, 2 * Math.PI, (2.5 * Math.PI) / 2);

          app.stage.addChild(arc3);

          // / Hole ////
          const rectAndHole = new PIXI.Graphics();

          rectAndHole.beginFill(0x00ff00);
          rectAndHole.drawRect(350, 350, 150, 150);
          rectAndHole.beginHole();
          rectAndHole.drawCircle(375, 375, 25);
          rectAndHole.drawCircle(425, 425, 25);
          rectAndHole.drawCircle(475, 475, 25);
          rectAndHole.endHole();
          rectAndHole.endFill();

          app.stage.addChild(rectAndHole);

          // // Line Texture Style ////
          const beatifulRect = new PIXI.Graphics();

          beatifulRect.lineTextureStyle(20, sprite.texture);
          beatifulRect.beginFill(0xff0000);
          beatifulRect.drawRect(80, 350, 150, 150);
          beatifulRect.endFill();

          app.stage.addChild(beatifulRect);
        }}
      />
    </View>
  );
}

function GraphicsDynamicScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <GLView
        style={{ width, height }}
        onContextCreate={async (context) => {
          const app = new PIXI.Application({
            context,
            width,
            height,
            antialias: true,
          });

          const graphics = new PIXI.Graphics();

          // set a fill and line style
          graphics.beginFill(0xff3300);
          graphics.lineStyle(10, 0xffd900, 1);

          // draw a shape
          graphics.moveTo(50, 50);
          graphics.lineTo(250, 50);
          graphics.lineTo(100, 100);
          graphics.lineTo(250, 220);
          graphics.lineTo(50, 220);
          graphics.lineTo(50, 50);
          graphics.endFill();

          // set a fill and line style again
          graphics.lineStyle(10, 0xff0000, 0.8);
          graphics.beginFill(0xff700b, 1);

          // draw a second shape
          graphics.moveTo(210, 300);
          graphics.lineTo(450, 320);
          graphics.lineTo(570, 350);
          graphics.quadraticCurveTo(600, 0, 480, 100);
          graphics.lineTo(330, 120);
          graphics.lineTo(410, 200);
          graphics.lineTo(210, 300);
          graphics.endFill();

          // draw a rectangle
          graphics.lineStyle(2, 0x0000ff, 1);
          graphics.drawRect(50, 250, 100, 100);

          // draw a circle
          graphics.lineStyle(0);
          graphics.beginFill(0xffff0b, 0.5);
          graphics.drawCircle(470, 200, 100);
          graphics.endFill();

          graphics.lineStyle(20, 0x33ff00);
          graphics.moveTo(30, 30);
          graphics.lineTo(600, 300);

          app.stage.addChild(graphics);

          // let's create a moving shape
          const thing = new PIXI.Graphics();
          app.stage.addChild(thing);
          thing.x = 800 / 2;
          thing.y = 600 / 2;

          let count = 0;

          app.ticker.add(function () {
            count += 0.1;

            thing.clear();
            thing.lineStyle(10, 0xff0000, 1);
            thing.beginFill(0xffff00, 0.5);

            thing.moveTo(
              -120 + Math.sin(count) * 20,
              -100 + Math.cos(count) * 20
            );
            thing.lineTo(
              120 + Math.cos(count) * 20,
              -100 + Math.sin(count) * 20
            );
            thing.lineTo(
              120 + Math.sin(count) * 20,
              100 + Math.cos(count) * 20
            );
            thing.lineTo(
              -120 + Math.cos(count) * 20,
              100 + Math.sin(count) * 20
            );
            thing.lineTo(
              -120 + Math.sin(count) * 20,
              -100 + Math.cos(count) * 20
            );

            thing.rotation = count * 0.1;
          });
        }}
      />
    </View>
  );
}
