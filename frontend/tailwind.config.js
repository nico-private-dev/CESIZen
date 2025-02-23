/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'title': ['Nunito'],
        'body': ['Plus Jakarta Sans'],
      },
    },
    colors: {
      transparent: 'transparent',
      'primary': '#3163FE',
      'secondary': '#0C2B4D',
      'white': '#FFFFFF',
      'gray': '#aaaaaa',
      'lightgray': '#f7f7f7',
      'error': '#ef233c',
    },
  },
  plugins: [],
};
