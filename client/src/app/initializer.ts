import { createEffect, createEvent, sample } from "effector"

import { parseCookieValue } from "@/shared/lib/parse-cookie-value"
import { router, history } from "@/shared/routing"

export const appInitializer = () => {
  const init = createEvent()
  const $$themeInitializer = createTheme()
  const $$routerHistory = createHistory()

  sample({
    clock: init,
    target: [$$themeInitializer.init, $$routerHistory.init],
  })

  return {
    init,
  }
}

function createTheme() {
  const init = createEvent()
  const setMainThemeFx = createEffect(() => {
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

function createHistory() {
  const init = createEvent()
  sample({
    clock: init,
    fn: () => history,
    target: router.setHistory,
  })
  return {
    init,
  }
}
