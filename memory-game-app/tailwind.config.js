const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        rotateAndMoveDown: {
          '0%': {
            transform: 'rotate(' + (Math.random() * 230 - 115) + 'deg) translateY(0)',
          },
          '100%': {
            transform: 'rotate(' + (Math.random() * 230 - 115) + 'deg) translateY(150vh)',
          },
        },
        spin: {
          '0%': { transform: 'rotate(0)' },
          '100%': { transform: 'rotate(360)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        }
      },
      screens: {
        'xsm': '475px',
        'xxsm': '375px',
        'xs': '320px',
        ...defaultTheme.screens,
      },
      animation: {
        rotateAndMoveDown: 'rotateAndMoveDown 2s ease forwards',
        spin: 'spin 2s linear infinite',
        fadeIn: 'fadeIn 1s ease',
        fadeOut: 'fadeOut 2s ease',
      },
    },
  },
  plugins: [
    require('tailwindcss-3d'),
    require('tailwind-scrollbar'),
  ],
}
