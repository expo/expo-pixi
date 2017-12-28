import { Image } from 'react-native';

class DOMNode {
  style = {};

  constructor(nodeName) {
    this.nodeName = nodeName;
  }
  get ownerDocument() {
    return window.document;
  }
  appendChild() {}
}

class DOMElement extends DOMNode {
  constructor(tagName) {
    return super(tagName.toUpperCase());
  }
  getContext() {
    if (global.canvasContext) {
      return global.canvasContext;
    }

    const stub = () => {};
    return {
      fillRect: stub,
      drawImage: stub,
      getImageData: stub,
      getContextAttributes: () => ({
        stencil: true,
      }),
      getExtension: () => ({
        loseContext: stub,
      }),
    };
  }
  addEventListener() {}
  removeEventListener() {}
}

class DOMDocument extends DOMElement {
  body = new DOMElement('BODY');

  constructor() {
    super('#document');
  }

  createElement(tagName) {
    return new DOMElement(tagName);
  }

  createElementNS(tagName) {
    const canvas = this.createElement(tagName);
    canvas.toDataURL = () => ({});
    return canvas;
  }

  getElementById() {
    return new DOMElement('div');
  }
}

window.addEventListener = window.addEventListener || (() => {});
window.removeEventListener = window.removeEventListener || (() => {});

global.document = window.document = new DOMDocument();
global.userAgent = global.navigator.userAgent = 'iPhone'; // <- This could be made better, but I'm not sure if it'll matter for PIXI

export class HTMLImageElement extends Image {
  constructor(asset) {
    super();
    if (!asset) {
      return;
    }
    const { localUri, width, height } = asset;
    this.complete = true;
    this.localUri = this.src = localUri;
    this.width = width;
    this.height = height;
  }
}
global.HTMLImageElement = global.Image = HTMLImageElement;

export class HTMLCanvasElement {
  constructor() {}
}

global.HTMLCanvasElement = HTMLCanvasElement;

export class HTMLVideoElement {
  constructor() {}
}

global.HTMLVideoElement = HTMLVideoElement;
