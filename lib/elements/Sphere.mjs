import { CSSStyleMixin } from '../mixins/CSSStyleMixin.mjs';
import { C3Object } from '../core/3DObject.mjs';
import { sphere } from '../shapes/sphere.mjs';

export class C3Sphere extends C3Object {
  #style;
  #radius;
  #background;

  constructor() {
    super();
    
    const shape = document.createElement('div');
    shape.style.transformStyle = 'preserve-3d';
    shape.innerHTML = sphere;
    this.shadowRoot.appendChild(shape);
  }

  static get observedAttributes() {
    return [
      ...C3Object.observedAttributes,
      'background',
      'radius'
    ];
  }
}

CSSStyleMixin(C3Sphere, [
  'background',
  'radius'
], true);

customElements.define('c3-sphere', C3Sphere);