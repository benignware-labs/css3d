import { CSSStyleMixin } from '../mixins/CSSStyleMixin.mjs';
import { C3Object } from '../core/3DObject.mjs';
import { cylinder } from '../shapes/cylinder.mjs';

class C3Cylinder extends C3Object {
  static get observedAttributes() {
    return [
      ...C3Object.observedAttributes,
      'background',
      'radius',
      'topRadius', 'top-radius',
      'bottomRadius', 'bottom-radius',
      'height',
      'facets'
    ];
  }

  constructor() {
    super();

    const shape = document.createElement('div');
    shape.style.transformStyle = 'preserve-3d';
    shape.innerHTML = cylinder;
    this.shadowRoot.appendChild(shape);
  }
}

CSSStyleMixin(C3Cylinder, [
  'background',
  'radius',
  'topRadius',
  'bottomRadius',
  'height',
  'facets'
], true);

customElements.define('c3-cylinder', C3Cylinder);

export { C3Cylinder };