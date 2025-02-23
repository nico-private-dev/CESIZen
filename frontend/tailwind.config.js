/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        primary: '#01BF62',
        secondary: '#FFDE59',
        black: '#1C1C1C',
        grey: '#E2E8F0',
        lowgrey: '#F7FAFC',
      },
    },
  },
  plugins: [],
};
