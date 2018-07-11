//@flow
import React from 'react';
import Expo from 'expo';
import { PanResponder, PixelRatio } from 'react-native';
import { vec2 } from 'gl-matrix';

import PIXI from '../Pixi';
import { takeSnapshotAsync } from '../utils';
import { BezierPath } from '../core/SignatureBezierPath';
import BezierProvider from '../core/SignatureBezierProvider';

global.__ExpoSignatureId = global.__ExpoSignatureId || 0;

type Props = {
  strokeColor: number | string,
  strokeAlpha: number,
  onChange: () => PIXI.Renderer,
  onReady: () => WebGLRenderingContext,
  initialLines?: Array<Point>,
};

const scale = PixelRatio.get();

function scaled({ locationX: x, locationY: y }) {
  const out = vec2.fromValues(x, y);
  vec2.scale(out, out, scale);
  return out;
}

type Point = {
  x: number,
  y: number,
  color: string | number,
  width: number,
  alpha: number,
};

export default class Signature extends React.Component<Props> {
  stage: PIXI.Stage;

  graphics;
  graphicsTmp;

  panResponder: PanResponder;
  renderer: PIXI.Renderer;

  provider = new BezierProvider();

  componentWillMount() {
    global.__ExpoSignatureId++;
  }

  componentDidMount() {
    this._setupPanResponder();
    this._drawSub = this.provider.addListener(BezierProvider.EVENT_DRAW_PATH, this._drawPath);
  }

  componentWillUnmount() {
    this._drawSub.remove();
  }

  _setupPanResponder = () => {
    const onEnd = nativeEvent => {
      this.provider.addPointToSignature(scaled(nativeEvent));
      this.provider.reset();

      setTimeout(() => this.props.onChange && this.props.onChange(this.renderer), 1);
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: ({ nativeEvent }) => {
        this._beginNewLine();
        this.provider.reset();
        this.provider.addPointToSignature(scaled(nativeEvent));
      },
      onPanResponderMove: ({ nativeEvent }) => {
        this.provider.addPointToSignature(scaled(nativeEvent));
      },
      onPanResponderRelease: ({ nativeEvent }) => onEnd(nativeEvent),
      onPanResponderTerminate: ({ nativeEvent }) => onEnd(nativeEvent),
    });
  };

  _beginNewLine = () => {
    this.graphics = new PIXI.Graphics();
    this.stage.addChild(this.graphics);
  };

  _drawPath = (type, points, finalized) => {
    this.graphicsTmp.clear();
    const graphics = finalized ? this.graphics : this.graphicsTmp;
    graphics.beginFill(this.props.strokeColor);
    graphics.lineStyle(1, this.props.strokeColor, this.props.strokeAlpha);

    BezierPath[type](points, graphics);

    graphics.endFill();
    this.renderer._update();
  };

  shouldComponentUpdate = () => false;

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
    }
  };

  takeSnapshotAsync = (...args) => {
    return takeSnapshotAsync(this.glView, ...args);
  };

  onContextCreate = async (context: WebGLRenderingContext) => {
    this.context = context;
    this.graphicsTmp = new PIXI.Graphics();

    this.stage = new PIXI.Container();
    this.stage.addChild(this.graphicsTmp);

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
  };

  onLayout = ({ nativeEvent: { layout: { width, height } } }) => {
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
      <Expo.GLView
        {...this.panResponder.panHandlers}
        onLayout={this.onLayout}
        key={'Expo.Signature-' + global.__ExpoSignatureId}
        ref={this.setRef}
        {...this.props}
        onContextCreate={this.onContextCreate}
      />
    );
  }
}
