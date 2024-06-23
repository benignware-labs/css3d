export const ensureUnit = (str = '', unit) => (str || '0').match(/[a-z%]+$/) ? str : `${str}${unit}`;

export const camelize = (str) => str.replace(/-./g, (s) => s.charAt(1).toUpperCase());

export const decamelize = (str) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();