//@flow
import React from 'react';
import Expo from 'expo';

import '../dom';
import * as PIXI from 'pixi.js';
import 'url';
import 'path';

import { textureAsync, spriteAsync } from '../ExpoPixi';
import { PixelRatio } from 'react-native';

global.__ExpoFilterImageId = global.__ExpoFilterImageId || 0;

export function filter(filters) {
  const output = new PIXI.filters.ColorMatrixFilter();
  if (Array.isArray(filters)) {
    filters.map(item => {
      if (typeof item === 'string') {
        output[item]();
      } else {
        const { name, props } = item;
        output[name](...props);
      }
    });
  } else {
    return filter([filters]);
  }

  return output;
}

function centerSprite(sprite: PIXI.Sprite, parent) {
  sprite.x = (parent.width - sprite.width) / 2;
  sprite.y = (parent.height - sprite.height) / 2;
}

function adjustRatio(sprite, parent, isCover) {
  const other = side => (side === 'width' ? 'height' : 'width');

  let longest;
  if (sprite.width < sprite.height) {
    longest = isCover ? 'width' : 'height';
  } else {
    longest = isCover ? 'height' : 'width';
  }

  let shortest = other(longest);

  const ratio = sprite[shortest] / sprite[longest];
  sprite[longest] = parent[longest];
  sprite[shortest] = parent[longest] * ratio;
}

type Props = {
  source: string | number | Expo.Asset,
  resizeMode: string,
  filters: Array<PIXI.Filter>,
};

export default class FilterImage extends React.Component<Props> {
  componentWillMount() {
    global.__ExpoFilterImageId++;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { props, state } = this;

    if (nextProps.resizeMode != props.resizeMode) {
      this.updateResizeMode(nextProps.resizeMode);
    }
    if (nextProps.source != props.source) {
      this.updateTextureAsync(nextProps.source);
    }
    if (nextProps.filters != props.filters) {
      this.updateFilters(nextProps.filters);
    }

    return false;
  }

  updateTextureAsync = async source => {
    if (!this.renderer || !this.image || !source) {
      return;
    }
    const texture = await textureAsync(source);
    if (source === this.props.source) {
      this.image.texture = texture;
    }
    this.update();
  };

  updateResizeMode = resizeMode => {
    if (!this.renderer || !this.image || !resizeMode) {
      return;
    }

    const cover = resizeMode.toLowerCase() === 'cover';

    adjustRatio(this.image, this.renderer, cover);
    centerSprite(this.image, this.renderer);
    this.update();
  };

  updateFilters = filters => {
    if (!this.renderer || !this.image || !filters) {
      return;
    }
    if (!Array.isArray(filters)) {
      this.image.filters = [filters];
    } else {
      this.image.filters = filters;
    }

    this.update();
  };

  update = () => {
    if (this.context.endFrameEXP) {
      this.renderer.render(this.stage);
      this.context.endFrameEXP();
    }
  };

  onLayout = ({ nativeEvent: { layout: { width, height } } }) => {
    if (this.renderer) {
      const scale = PixelRatio.get();
      this.renderer.resize(width * scale, height * scale);
    }
    this.updateResizeMode(this.props.resizeMode);
  };

  onContextCreate = async (context: WebGLRenderingContext) => {
    const { filters, resizeMode, source, ...props } = this.props;

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
      },
    );

    this.image = await spriteAsync(source);
    this.stage.addChild(this.image);

    this.updateResizeMode(resizeMode);
    this.updateFilters(filters);

    this.props.onReady && this.props.onReady(this.context);
  };

  render() {
    return (
      <Expo.GLView
        onLayout={this.onLayout}
        key={'Expo.FilterImage-' + global.__ExpoSketchId}
        {...this.props}
        onContextCreate={this.onContextCreate}
      />
    );
  }
}
