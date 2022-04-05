import { join } from 'path'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [inspect(), solidPlugin()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
  resolve: {
    alias: {
      '~': join(__dirname, './src'),
    },
  },
})
