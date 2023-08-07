import { createEvent, createEffect, sample } from "effector"

import { parseCookieValue } from "../lib/parse-cookie-value"

export const createTheme = () => {
  const init = createEvent()
  const setMainThemeFx = createEffect(() => {
    const theme = parseCookieValue("theme")
    if(theme) {
      console.log(theme)
      document.documentElement.setAttribute("data-theme", `${theme}`)
    }
  })
  const setAccentThemeFx = createEffect(() => {
    const accent = parseCookieValue("accent")
    document.documentElement.style.setProperty(
      "--accent",
      `var(--${accent || "blue"})`,
    )
  })
  sample({
    clock: init,
    target: [setMainThemeFx, setAccentThemeFx],
  })
  return {
    init,
  }
}