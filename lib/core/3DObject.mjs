import { CSSStyleMixin } from '../mixins/CSSStyleMixin.mjs';
import { Vector3 } from '../math/Vector3.mjs';
import { camelize } from '../utils.mjs';

class C3Object extends HTMLElement {
  #style;

  constructor() {
    super();

    this.render = this.render.bind(this);

    this.attachShadow({ mode: 'open' });

    // Create stylesheet
    this.#style = document.createElement('style');
    this.#style.textContent = `
      :host {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        display: block;
        pointer-events: auto;
        user-select: none;
        transform-style: preserve-3d;
      }

      :host * {
        transform-style: preserve-3d;
      }

      :host::before {
        content: '';
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        outline: 5px solid blue;
        transform-style: preserve-3d;
      }
    `;
  
    this.shadowRoot.appendChild(this.#style);
  }

  static get observedAttributes() {
    return [
      'position',
      'rotate',
      'scale',
      'animation',
      'background',
      'color'
    ];
  }

  static getPosition(target) {
    const position = window.getComputedStyle(target).getPropertyValue('translate');
    console.log('position', position);
    const [x = 0, y = 0, z = 0] = position
      .split(/\s+/)
      .map((n = '') => Number(n.replace(/px$/g, '')))
      .map(n => !isNaN(n) ? n : 0);

    return new Vector3(x, y, z);
  }

  connectedCallback() {
    window.requestAnimationFrame(() => this.render());
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    const prop = camelize(name);

    if (Reflect.has(this, prop)) {
      this[prop] = newValue;
    } else {
      this.render();
    }
  }

  get x() {
    return C3Object.getPosition(this).x;
  }

  get y() {
    return C3Object.getPosition(this).y;
  }

  get z() {
    return C3Object.getPosition(this).y;
  }

  get scene() {
    return this.closest('c3-scene');
  }

  render() {
    
  }
}

CSSStyleMixin(C3Object, [
  ['position', 'translate'],
  'rotate',
  'scale',
  'animation'
]);

export { C3Object };