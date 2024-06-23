import { PerspectiveCamera } from '../cameras/PerspectiveCamera.mjs';
import { CSS3DRenderer } from './Renderer.mjs';
import { OrbitControls } from '../controls/OrbitControls.mjs';

class C3Scene extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    const slot = document.createElement('slot');
    slot.style.display = 'block';
    slot.style.transformStyle = 'preserve-3d';
    this.shadowRoot.appendChild(slot);

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 100vw;
        height: 100vh;
        outline: 1px solid #ff00ff;
        overflow: hidden;
        position: relative;
        perspective: 300px;
        -webkit-perspective: 300px;
        perspective-origin: center center;
        transform-style: preserve-3d;
        -webkit-transform-style: preserve-3d;
      }
    `;

    this.shadowRoot.appendChild(style);
  }
}

customElements.define('c3-scene', C3Scene);