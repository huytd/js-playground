const plugin = require('tailwindcss/plugin')

module.exports = {
  theme: {
    extend: {
      colors: {
        mono: {
          100: "#a1a7a9",
          200: '#798285',
          300: '#61686a',
          400: '#555b5d',
          500: '#494e50',
          600: '#3d4143',
          700: '#313436',
          800: '#252729',
          900: '#191a1c'
        }
      }
    },
  },
  variants: {
      backgroundColor: [ 'hover', 'focus', 'dark-mode' ],
      textColor: [ 'hover', 'focus', 'dark-mode' ],
      borderColor: [ 'hover', 'focus', 'dark-mode' ],
  },
  plugins: [
      plugin(function({ addVariant, e }) {
          addVariant('dark-mode', function({ modifySelectors, separator }) {
              modifySelectors(function({ className }) {
                  return `.dark-mode .${e(`dark-mode${separator}${className}`)}`;
              })
          })
      })
  ],
}
