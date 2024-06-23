import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import polyfillNode from 'rollup-plugin-polyfill-node';

console.log('rollup.config.js');

export default {
  input: 'index.mjs',
  output: {
    file: 'dist/css3d.mjs',
    format: 'es'
  },
  plugins: [
    nodeResolve({
      preferBuiltins: true
    }),
    commonjs(),
    polyfillNode()
  ]
};