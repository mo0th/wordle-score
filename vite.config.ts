import { join } from 'path'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import inspect from 'vite-plugin-inspect'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  plugins: [
    inspect(),
    solidPlugin(),
    createHtmlPlugin({
      minify: true,
    }),
  ],
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
