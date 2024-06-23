import { C3Object } from '../core/3DObject.mjs';
import { CSSStyleMixin } from '../mixins/CSSStyleMixin.mjs';

export class C3Element extends C3Object {
  static get observedAttributes() {
    return [
      ...C3Object.observedAttributes,
      'width',
      'height',
      'background',
      'color',
      'font-size',
      'clip-path',
    ];
  }

  constructor() {
    super();
    
    const slot = document.createElement('slot');
    slot.style.display = 'block';
    slot.style.transformStyle = 'preserve-3d';
    slot.classList.add('view');
    this.shadowRoot.appendChild(slot);
  }
}

CSSStyleMixin(C3Element, [
  'width',
  'height',
  'background',
  'color',
  'fontSize',
  'clipPath',
]);

customElements.define('c3-element', C3Element);