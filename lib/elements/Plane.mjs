import { C3Object } from '../core/3DObject.mjs';

export class C3Plane extends C3Object {
  #style;
  #background;
  #width;
  #height;

  constructor() {
    super();
    
    this.render = this.render.bind(this);

    this.#background = 'gray';
    this.#width = '100px';
    this.#height = '100px';

    this.#style = document.createElement('style');
    this.shadowRoot.appendChild(this.#style);

    const plane = document.createElement('div');
    plane.classList.add('plane');
    this.shadowRoot.appendChild(plane);
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'background', 'color', 'width', 'height'];
  }

  set background(background) {
    this.#background = background;

    this.render();
  }

  get background() {
    return this.#background;
  }

  set width(width) {
    this.#width = width;

    this.render();
  }

  get width() {
    return this.#width;
  }

  set height(height) {
    this.#height = height;
  }

  get height() {
    return this.#height;
  }

  render() {
    super.render();
    this.#style.textContent = `
      :host {
        --width: ${this.#width};
        --height: ${this.#height};
        --background: ${this.#background};
      }

      :host .plane {
        background: var(--background);
        width: var(--width);
        height: var(--height);
        /*transform: translate(-50%, -50%) rotateX(45deg) rotateY(45deg) rotateZ(45deg);*/
        transform: rotate3d(1, 0, 0, 90deg);
      }
    `;
  }
}

customElements.define('c3-plane', C3Plane);