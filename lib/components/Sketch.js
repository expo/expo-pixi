//@flow
import { GLView } from 'expo-gl';
import React from 'react';
import { PanResponder, PixelRatio } from 'react-native';

import PIXI from '../Pixi';
import { takeSnapshotAsync } from '../utils';

global.__ExpoSketchId = global.__ExpoSketchId || 0;

type Props = {
  strokeColor: number | string,
  strokeWidth: number,
  strokeAlpha: number,
  onChange: () => PIXI.Renderer,
  onReady: () => WebGLRenderingContext,
  initialLines?: Array<Point>,
};

const scale = PixelRatio.get();

function scaled({ locationX: x, locationY: y }) {
  return { x: x * scale, y: y * scale };
}

type Point = {
  x: number,
  y: number,
  color: string | number,
  width: number,
  alpha: number,
};

export default class Sketch extends React.Component<Props> {
  lines = [];
  stage: PIXI.Stage;
  graphics;
  points = [];
  lastPoint: Point;
  lastTime: number;
  ease: number = 0.3; // only move 0.3 in the direction of the pointer, this smooths it out
  delay: number = 10;
  panResponder: PanResponder;
  renderer: PIXI.Renderer;

  UNSAFE_componentWillMount() {
    global.__ExpoSketchId++;
    this.setupPanResponder();
  }

  setupPanResponder = () => {
    const onEnd = event => {
      this.drawLine(scaled(event), false);

      setTimeout(() => this.props.onChange && this.props.onChange(this.renderer), 1);
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: ({ nativeEvent }) => {
        const { x, y } = scaled(nativeEvent);
        const { strokeColor: color, strokeWidth: width, strokeAlpha: alpha } = this.props;
        this.drawLine(
          {
            x,
            y,
            color,
            width,
            alpha,
          },
          true
        );
      },
      onPanResponderMove: ({ nativeEvent }) => {
        const point = scaled(nativeEvent);
        // throttle updates: once for every 10ms
        const time = Date.now();
        const delta = time - this.lastTime;
        if (delta < this.delay) return;
        this.lastTime = time;

        this.drawLine(
          {
            x: this.lastPoint.x + this.ease * (point.x - this.lastPoint.x),
            y: this.lastPoint.y + this.ease * (point.y - this.lastPoint.y),
            color: this.props.strokeColor,
            width: this.props.strokeWidth,
            alpha: this.props.strokeAlpha,
          },
          false
        );
      },
      onPanResponderRelease: ({ nativeEvent }) => onEnd(nativeEvent),
      onPanResponderTerminate: ({ nativeEvent }) => onEnd(nativeEvent),
    });
  };

  shouldComponentUpdate = () => false;

  persistStroke = () => {
    if (this.graphics) {
      this.graphics.points = this.points;
      this.lines.push(this.graphics);
    }
    this.lastTime = 0;
    this.points = [];
  };
  drawLine(point: Point, newLine: boolean) {
    if (!this.renderer || (!newLine && !this.graphics)) {
      return;
    }

    if (newLine) {
      this.persistStroke();
      this.graphics = new PIXI.Graphics();
      this.stage.addChild(this.graphics);
      this.lastPoint = point;
      this.points = [point];
      return;
    }
    this.lastPoint = point;
    this.points.push(point);

    this.graphics.clear();
    for (let i = 0; i < this.points.length; i++) {
      const { x, y, color, width, alpha } = this.points[i];
      if (i === 0) {
        this.graphics.lineStyle(
          width || this.props.strokeWidth || 10,
          color || this.props.strokeColor || 0x000000,
          alpha || this.props.strokeAlpha || 1
        );
        this.graphics.moveTo(x, y);
      } else {
        this.graphics.lineTo(x, y);
      }
    }
    this.graphics.currentPath.shape.closed = false;
    this.graphics.endFill(); /// TODO: this may be wrong: need stroke
    this.renderer._update();
  }

  undo = () => {
    if (!this.renderer) {
      return null;
    }

    const { children } = this.stage;
    if (children.length > 0) {
      const child = children[children.length - 1];
      this.stage.removeChild(child);
      this.renderer._update();
      // TODO: This doesn't really work :/
      setTimeout(() => this.props.onChange && this.props.onChange(this.renderer), 2);
      return child;
    } else if (this.points.length > 0) {
      this.persistStroke();
      return this.undo();
    }
  };

  clear = () => {
    this.provider.reset();
    if (!this.renderer) {
      return null;
    }

    if (this.stage.children.length > 0) {
      this.stage.removeChildren();
      this.renderer._update();
    }

    return null;
  };

  takeSnapshotAsync = (...args) => {
    return takeSnapshotAsync(this.glView, ...args);
  };

  onContextCreate = async (context: WebGLRenderingContext) => {
    this.context = context;
    this.stage = new PIXI.Container();

    const getAttributes = context.getContextAttributes || (() => ({}));
    context.getContextAttributes = () => {
      const contextAttributes = getAttributes();
      return {
        ...contextAttributes,
        stencil: true,
      };
    };

    this.renderer = PIXI.autoDetectRenderer(
      context.drawingBufferWidth,
      context.drawingBufferHeight,
      {
        context,
        antialias: true,
        backgroundColor: 'transparent',
        transparent: true,
        autoStart: false,
      }
    );
    this.renderer._update = () => {
      this.renderer.render(this.stage);
      context.endFrameEXP();
    };
    this.props.onReady && this.props.onReady(context);

    const { initialLines } = this.props;
    if (initialLines) {
      for (let line of initialLines) {
        this.buildLine(line);
      }
      this.lines = initialLines;
    }
  };

  buildLine = ({ points, color, alpha, width }) => {
    for (let i = 0; i < points.length; i++) {
      this.drawLine({ color, alpha, width, ...points[i] }, i === 0);
    }
  };

  onLayout = ({
    nativeEvent: {
      layout: { width, height },
    },
  }) => {
    if (this.renderer) {
      const scale = PixelRatio.get();
      this.renderer.resize(width * scale, height * scale);
      this.renderer._update();
    }
  };

  setRef = ref => {
    this.glView = ref;
  };

  render() {
    return (
      <GLView
        {...this.panResponder.panHandlers}
        onLayout={this.onLayout}
        key={'Expo.Sketch-' + global.__ExpoSketchId}
        ref={this.setRef}
        {...this.props}
        onContextCreate={this.onContextCreate}
      />
    );
  }
}
