import { join } from 'path'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    inspect(),
    solidPlugin(),
    // createHtmlPlugin({
    //   minify: {
    //     collapseWhitespace: true,
    //     keepClosingSlash: true,
    //     removeComments: true,
    //     removeRedundantAttributes: true,
    //     removeScriptTypeAttributes: true,
    //     removeStyleLinkTypeAttributes: true,
    //     useShortDoctype: true,
    //     minifyCSS: true,
    //     minifyJS: true,
    //   },
    // }),
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
