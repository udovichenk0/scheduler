import { createEvent, createEffect, sample } from "effector"

import { parseCookieValue } from "../lib/storage/parse-cookie-value"

export const createTheme = () => {
  const init = createEvent()
  const setMainThemeFx = createEffect(async () => {
    const theme = parseCookieValue("theme")
    document.documentElement.setAttribute("data-theme", `${theme || "default"}`)
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
