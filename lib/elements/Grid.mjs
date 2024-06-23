import { C3Object } from "../core/3DObject.mjs";

export class C3Grid extends C3Object {
  #style;

  constructor() {
    super();

    this.#style = document.createElement('style');
    this.shadowRoot.appendChild(this.#style);
  }

  connectedCallback() {
    this.render();
  }

  render() {
    super.render();
    const f = 1;
    const size = parseFloat(this.getAttribute('size') || '200px');
    const divisions = parseInt(this.getAttribute('divisions') || '10');
    const width = size * f;
    const height = size * f;

    this.shadowRoot.host.style.setProperty('--color', 'rgba(2555, 255, 255, 0.5)');

   this.#style.textContent = `
      :host {
        --size: ${size}px;
        --divisions: ${divisions};
      }
      
      :host::after {
        --stroke: 2.5px;
        --tile: calc(var(--size) / var(--divisions));
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: calc(var(--size) + var(--stroke));
        height: calc(var(--size) + var(--stroke));
        background: repeating-linear-gradient(90deg, var(--color), var(--color) 1px, transparent 1px, transparent var(--tile)) 
            , repeating-linear-gradient(180deg, var(--color), var(--color) 1px, transparent 1px, transparent var(--tile));
        transform: rotateX(90deg)  translate(-50%, -50%);
        transform-style: preserve-3d;
        transform-origin: 0 0;
      }
    `;
  }
}

customElements.define('c3-grid', C3Grid);