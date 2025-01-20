/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './content/**/*.md',
    './templates/**/*.html',
    './theme/**/*.html',
  ],
  theme: {
    colors: {
      'black': '#212121',
      'white': '#fafafa',
      'gray': '#c1c1c1',
      'gray-dark': '#3d3d3d',
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
