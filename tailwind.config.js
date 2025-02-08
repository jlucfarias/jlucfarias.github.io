const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './content/**/*.md',
    './templates/**/*.html',
    './theme/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        'black': '#212121',
        'white': '#fafafa',
        'gray-500': '#c1c1c1',
        'gray-800': '#3d3d3d',
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(({ addVariant }) => {
      addVariant('has-hover', '@media (hover: hover) and (pointer: fine)')
    }),
  ],
}
