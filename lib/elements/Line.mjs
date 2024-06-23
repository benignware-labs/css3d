import { C3Object } from '../core/3DObject.mjs';
import { CSSStyleMixin } from '../mixins/CSSStyleMixin.mjs';

class C3Line extends C3Object {
  #shape;

  static get observedAttributes() {
    return [
      ...C3Object.observedAttributes,
      'length'
    ];
  }

  constructor() {
    super();

    this.#shape = document.createElement('div');

    this.shadowRoot.appendChild(this.#shape);
  }

  render() {
    super.render();

    this.#shape.innerHTML = `
      <style>
        :host {
          --length: 100px;
        }

        .line {
          position: absolute;
          width: var(--length);
          height: 1px;
          background: currentColor;
        }

      </style>
      <div class="line"></div>
    `;
  }
}

CSSStyleMixin(C3Line, [
  'length',
], true);

customElements.define('c3-line', C3Line);

export { C3Line };