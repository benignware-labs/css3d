import { CSSStyleMixin } from '../mixins/CSSStyleMixin.mjs';
import { C3Object } from '../core/3DObject.mjs';
import { C3Group } from '../elements/Group.mjs';
import { polyhedron } from '../shapes/polyhedron.mjs';
import { centroid } from '../math/utils.mjs';
import { Vector3 } from '../math/Vector3.mjs';


class C3Polyhedron extends C3Group {
  #shape;

  static get observedAttributes() {
    return [
      ...C3Object.observedAttributes,
      'background'
    ];
  }

  constructor() {
    console.log('C3Polyhedron constructor...')
    super();

    this.handleSlotChange = this.handleSlotChange.bind(this);

    this.#shape = document.createElement('div');
    this.#shape.style.transformStyle = 'preserve-3d';
    
    this.shadowRoot.appendChild(this.#shape);
  }

  get vertices() {
    return [...this.querySelectorAll('c3-vertex')]
  }

  render() {
    console.log('render polyhedron...');
    super.render();

    console.log('this', this);

    const points = [...this.querySelectorAll('c3-vertex')]
      .map(vertex => [...C3Object.getPosition(vertex)]);

    console.log('points', points);


    this.#shape.innerHTML = polyhedron(points);
  }
}

CSSStyleMixin(C3Polyhedron, [
  'background'
], true);

customElements.define('c3-polyhedron', C3Polyhedron);

export { C3Polyhedron };