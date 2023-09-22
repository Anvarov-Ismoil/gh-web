/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-green': '#37D200',
        'light-yellow': '#FFC107',
        'light-red': '#FF0000',
        'light-gray': '#6C757D',
      },
    },
    container: {
      center: true,
    },
  },
  plugins: [],
}

