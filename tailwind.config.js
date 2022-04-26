const { fontFamily } = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['index.html', 'src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          1: 'var(--base-1)',
          2: 'var(--base-2)',
          3: 'var(--base-3)',
          4: 'var(--base-4)',
          5: 'var(--base-5)',
        },
      },
      fontFamily: {
        poppins: ["'Poppins'", ...fontFamily.sans],
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require('@tailwindcss/forms')({ strategy: 'class' }),
    require('@tailwindcss/aspect-ratio'),
    plugin(({ addVariant }) => {
      addVariant('hocus', ['&:hover', '&:focus'])
      addVariant('hocus-within', ['&:hover', '&:focus-within'])
      addVariant('group-hocus', [':merge(.group):hover &', ':merge(.group):focus &'])
      addVariant('active', ['&[data-active]', '&:active'])
    }),
  ],
}
