import { PerspectiveCamera } from '../cameras/PerspectiveCamera.mjs';
import { CSS3DRenderer } from './Renderer.mjs';
import { OrbitControls } from '../controls/OrbitControls.mjs';

class C3Scene extends HTMLElement {
  #camera;
  #controls;
  #renderer;

  constructor() {
    super();

    this.handleResize = this.handleResize.bind(this);
    this.render = this.render.bind(this);

    // Add any initialization code here
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          min-height: 250px;
          display: flex;
          overflow: hidden;
          position: relative;
          perspective: 1000px;
          perspective-origin: center center;
          transform-style: preserve-3d;
          aspect-ratio: 16/9;
          padding: 0;
        }

        :host * {
          transform-style: preserve-3d;
          box-sizing: border-box;
        }

        :host .view {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          transform-style: preserve-3d;
        }

        :host slot {
          display: block;
          transform-style: preserve-3d;
        }

      </style>
      <div class="view">
        <div class="camera">
          <slot></slot>
        </div>
      </div>
    `;

    const { width, height } = this.getBoundingClientRect();

    this.#camera = new PerspectiveCamera(45, width / height, 1, 1000);
    this.#camera.position.x = 0;
    this.#camera.position.y = 100;
    this.#camera.position.z = 1000;
    
    const viewElement = shadowRoot.querySelector('.view');
    const cameraElement = shadowRoot.querySelector('.camera');

    this.#renderer = new CSS3DRenderer(this.#camera, viewElement, cameraElement);
    this.#renderer.setSize(width, height);

    this.render();

    this.#camera.lookAt(0, 0, 0);

    this.handleResize();
  }

  static get observedAttributes() {
    return [
      'controls',
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    if (name === 'controls') {
      if (newValue !== null) {
        const viewElement = this.shadowRoot.querySelector('.view');
        this.#controls = new OrbitControls(this.#camera, viewElement);
        this.#controls.addEventListener('change', this.render);
      } else if (this.#controls) {
        this.#controls.dispose();
        this.#controls = null;
      }
      
    }
  }

  get camera() {
    return this.#camera;
  }

  connectedCallback() {
    window.addEventListener('resize', this.handleResize);

    this.render();
  }

  handleResize() {
    const { width, height } = this.getBoundingClientRect();

    this.#camera.aspect = width / height;
    this.#camera.updateProjectionMatrix();
    this.#renderer.setSize(width, height);
  }

  render() {
    this.#renderer.render();
  }
}

customElements.define('c3-scene', C3Scene);

export { C3Scene };