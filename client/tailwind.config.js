/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  lightMode: "class",
  defaultMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      dropShadow: {
        base: "0 35px 35px rgba(0, 0, 0, 0.56)",
      },
      colors: {
        "main-blue": "#0b0417",
        azure: "#2ebcff",
        error: "#ff5f58",
        grey: "#76899b",
        space: "#76899b",
        main: "var(--main)",
        accent: "rgba(var(--accent))",
        accentBlue: "rgb(var(--blue))",
        accentYellow: "rgb(var(--yellow))",
        accentRed: "rgb(var(--red))",
        accentOrange: "rgb(var(--orange))",
        accentGreen: "rgb(var(--green))",
        accentPurple: "rgb(var(--purple))",
        accentPink: "rgb(var(--pink))",
        primary: "var(--primary)",
        cHover: "rgba(var(--accent), 0.2)",
        brand: "var(--brand)",
        cFont: "var(--cFont)",
        cBorder: "var(--cBorder)",
        cFocus: "rgba(var(--accent), 0.3)",
        cOpacitySecondFont: "var(--cOpacitySecondFont)",
        cSecondBorder: "var(--cSecondBorder)",
        cLeftBottomPanel: "var(--cLeftBottomPanel)",
        cButtonBg: "var(--cButtonBg)",
        cButtunHover: "var(--cButtunHover)",
        cButtonText: "var(--cButtonText)",
        cTaskEdit: "var(--cTaskEdit)",
        cFocusSecond: "var(--cFocusSecond)",
        cTaskEditDefault: "var(--cTaskEditDefault)",
        cTimeIntervalLow: "var(--cTimeIntervalLow)",
        cIconDefault: "var(--cIconDefault)",
        cTimeInterval: "var(--cTimeInterval)",
        cPomodoroRed: "var(--cPomodoroRed)",
        cPomodoroGreen: "var(--cPomodoroGreen)",
        cCalendarFont: "var(--cCalendarFont)",
        cCalendarTooltip: "var(--cCalendarTooltip)",
      },
    },
  },
}
