/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0a1628',
          2: '#0f1f3d',
          3: '#152a52',
        },
        gold: {
          DEFAULT: '#c9a84c',
          2: '#e8c97a',
          3: '#f5e0a0',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Josefin Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}