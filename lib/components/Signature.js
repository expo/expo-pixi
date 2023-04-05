//@flow
import React from 'react';
import { GLView } from 'expo-gl';
import { PanResponder, PixelRatio } from 'react-native';
import { vec2 } from 'gl-matrix';

import PIXI from '../Pixi';
import { takeSnapshotAsync } from '../utils';
import { BezierPath, BezierProvider } from '../core/signature';

global.__ExpoSignatureId = global.__ExpoSignatureId || 0;

type Props = {
  strokeColor: number | string,
  strokeAlpha: number,
  onChange: () => PIXI.Renderer,
  onReady: () => WebGLRenderingContext,
};

const scale = PixelRatio.get();

function scaled(nativeEvent) {
  const out = vec2.fromValues(nativeEvent.locationX, nativeEvent.locationY);
  vec2.scale(out, out, scale);
  return out;
}

export default class Signature extends React.Component<Props> {
  stage: PIXI.Stage;

  graphics;
  graphicsTmp;

  panResponder: PanResponder;
  renderer: PIXI.Renderer;

  constructor(props, context) {
    super(props, context);

    this.provider = new BezierProvider();
    this._setupPanResponder();
  }

  UNSAFE_componentWillMount() {
    global.__ExpoSignatureId++;
  }

  componentDidMount() {
    this._drawSub = this.provider.addListener(BezierProvider.EVENT_DRAW_PATH, this._drawPath);
  }

  componentWillUnmount() {
    this._drawSub.remove();
  }

  _setupPanResponder = () => {
    const onEnd = nativeEvent => {
      this.provider.addPointToSignature(scaled(nativeEvent), true);
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
        backgroundColor: 0xffffff,
        transparent: false,
        autoStart: false,
      }
    );
    this.renderer._update = () => {
      this.renderer.render(this.stage);
      context.endFrameEXP();
    };
    this.props.onReady && this.props.onReady(context);
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
        key={'Expo.Signature-' + global.__ExpoSignatureId}
        ref={this.setRef}
        {...this.props}
        onContextCreate={this.onContextCreate}
      />
    );
  }
}
