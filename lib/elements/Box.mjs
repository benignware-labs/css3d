import { CSSStyleMixin } from '../mixins/CSSStyleMixin.mjs';
import { C3Object } from '../core/3DObject.mjs';
import { box } from '../shapes/box.mjs';

class C3Box extends C3Object {
  static get observedAttributes() {
    return [
      ...C3Object.observedAttributes,
      'background',
      'width',
      'height',
      'depth'
    ];
  }

  constructor() {
    super();

    const shape = document.createElement('div');
    shape.style.transformStyle = 'preserve-3d';
    shape.innerHTML = box;
    this.shadowRoot.appendChild(shape);
  }
}

CSSStyleMixin(C3Box, [
  'background',
  'width',
  'height',
  'depth'
], true);

customElements.define('c3-box', C3Box);

export { C3Box };