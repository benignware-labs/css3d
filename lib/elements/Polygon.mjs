import { C3Object } from '../core/3DObject.mjs';

class C3Polygon extends C3Object {
  static get observedAttributes() {
    return [
      ...C3Object.observedAttributes,
    ];
  }
}

customElements.define('c3-polygon', C3Polygon);

export { C3Polygon };