/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  lightMode: 'class',
  defaultMode: 'class',
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
        'grey': '#76899b',
        'space': '#76899b',
        'main': "var(--main)",
        'accent': "var(--accent)",
        'accentYellow': 'var(--accentYellow)',
        'accentRed': 'var(--accentRed)',
        'accentOrange': 'var(--accentOrange)',
        'accentGreen': 'var(--accentGreen)',
        'accentPurple': 'var(--accentPurple)',
        'accentPink': 'var(--accentPink)',
        'primary': "var(--primary)",
        'cHover': 'var(--cHover)',
        'brand': 'var(--brand)',
        'cFont': 'var(--cFont)',
        'cBorder': 'var(--cBorder)',
        'cFocus': 'var(--cFocus)',
        'cOpacitySecondFont': 'var(--cOpacitySecondFont)',
        'cSecondBorder': 'var(--cSecondBorder)',
        'cLeftBottomPanel': 'var(--cLeftBottomPanel)',
        'cButtonBg': 'var(--cButtonBg)',
        'cButtunHover': 'var(--cButtunHover)',
        'cButtonText': 'var(--cButtonText)',
        'cTaskEdit': 'var(--cTaskEdit)',
        'cFocusSecond': 'var(--cFocusSecond)'
      }
    },
  },
}
