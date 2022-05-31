import css from 'rollup-plugin-css-only'
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/main.js',
    format: 'es',
    sourcemap: true,
    plugins: [terser()]
  },
  plugins: [
    resolve(),
    css({
      output: 'main.css',
    })
  ],
}
