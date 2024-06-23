import { C3Object } from '../core/3DObject.mjs';

class C3Group extends C3Object {
  #slot;
  // #mutationObserver;

  static get observedAttributes() {
    return [...C3Object.observedAttributes];
  }

  constructor() {
    super();

    this.handleSlotChange = this.handleSlotChange.bind(this);
    
    const slot = document.createElement('slot');
    slot.style.display = 'block';
    slot.style.transformStyle = 'preserve-3d';
    this.shadowRoot.appendChild(slot);

    slot.addEventListener('slotchange', this.handleSlotChange);

    // this.#mutationObserver = new MutationObserver(mutations => {
    //   console.log('MUTATION: ', mutations);
    //   for (let mutation of mutations) {
    //     if (mutation.type === 'childList') {
    //       console.log('A child node has been added or removed.');

    //       mutation.addedNodes.forEach(node => {
    //         if (node instanceof C3Object) {
    //           node.addEventListener('change', this.handleChildrenChange);
    //         }
    //       });

    //       mutation.removedNodes.forEach(node => {
    //         if (node instanceof C3Object) {
    //           node.removeEventListener('change', this.handleChildrenChange);
    //         }
    //       });
    //     }
    //   }
    // });

    this.#slot = slot;
    
    // this.#mutationObserver.observe(this.#slot, { childList: true });
  }

  disconnectedCallback() {
    // this.#mutationObserver.unobserve(this.#slot);
    // this.#mutationObserver.disconnect();
    this.#slot.removeEventListener('slotchange', this.handleSlotChange);
  }

  // handleChildrenChange() {
  //   console.log('*********** children change...');
  //   this.render();
  // }

  handleSlotChange() {
    // this.#slot.assignedNodes().forEach(node => {
    //   if (node instanceof C3Object) {
    //     node.removeEventListener('change', this.handleChildrenChange);
    //     node.addEventListener('change', this.handleChildrenChange);
    //   }
    // });
    console.log('****** slot change...');
    this.render();
  }
}

customElements.define('c3-group', C3Group);

export { C3Group }; 