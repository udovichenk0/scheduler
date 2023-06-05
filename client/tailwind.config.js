/** @type {import('tailwindcss').Config} */
export default {
  darkMode: [
    "class"
  ],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'main-blue': '#0b0417',
        'azure': '#2ebcff',
        'error': '#ff5f58',
        'grey': '#76899b'
      }
    },
  },
}
