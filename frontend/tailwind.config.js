/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#534AB7',
          light: '#F8F7FF',
          dark: '#3C3489'
        },
        sidebar: {
          bg: '#26215C',
          active: '#3C3489',
          text: '#AFA9EC'
        }
      }
    },
  },
  plugins: [],
}
