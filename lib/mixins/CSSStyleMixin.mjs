import { decamelize } from "../utils.mjs";

export const getStylesheet = (shadowRoot) => {
  let style = shadowRoot.querySelector('style[data-c3-style-handle]');

  if (!style) {
    style = document.createElement('style');
    style.setAttribute('data-c3-style-handle', '');
    shadowRoot.appendChild(style);
  }

  return style.sheet;
}

export const CSSStyleMixin = (
  clazz,
  props,
  isVar = false,
  callback = (target, prop, newValue) =>
      target.dispatchEvent(new CustomEvent('change', { bubbles: false, detail: { name: prop, value: newValue } }))
) => {
  props.forEach(prop => {
    const name = typeof prop === 'string' ? prop : prop[1];
    prop = typeof prop === 'string' ? prop : prop[0];
  
    Object.defineProperty(clazz.prototype, prop, {
      configurable: true,
      get() {
        return window.getComputedStyle(this.shadowRoot.host).getPropertyValue(
          isVar ? `--${name}` : name
        );
      },
      set(value) {
        const sheet = getStylesheet(this.shadowRoot);
        const rule = [...sheet.cssRules].filter(rule => rule.selectorText === ':host')[0];
        const hyphenated = decamelize(name);
        const oldValue = this[prop];

        if (rule) {
          rule.style.setProperty(isVar ? `--${name}` : hyphenated, value);
        } else {
          sheet.insertRule(`:host {
            ${isVar ? `--${name}` : hyphenated}: ${value};
          }`, 0);
        }

        const newValue = this[prop];

        if (oldValue !== newValue && callback) {
          callback(this, prop, newValue, oldValue);
        }
      }
    });
  });
}
