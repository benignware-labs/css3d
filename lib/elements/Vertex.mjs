import { C3Object } from '../core/3DObject.mjs';

class C3Vertex extends C3Object {
  static get observedAttributes() {
    return [
      ...C3Object.observedAttributes,
    ];
  }
}

customElements.define('c3-vertex', C3Vertex);

export { C3Vertex };