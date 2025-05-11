import { createEvent, createStore, sample } from "effector"
import { createEffect } from "effector/effector.umd"
import { z } from "@zod/mini"

import { singleton } from "@/shared/lib/effector/singleton"
import { setCookie } from "@/shared/lib/storage/set-cookie.ts"
import { getCookie } from "@/shared/lib/storage/get-cookie"
const ThemeSchema = z.enum(["space", "default", "dark", "light", "grey"])

export type Theme = z.infer<typeof ThemeSchema>
export const $$themeSettings = singleton(() => {
  const init = createEvent()
  const themeChanged = createEvent<Theme>()
  const $theme = createStore<Theme>("default")

  const changeThemeFx = createEffect((theme: Theme) => {
    if (ThemeSchema.safeParse(theme).success) {
      document.documentElement.setAttribute("data-theme", theme)
      setCookie("theme", theme)
    }
  })
  const initThemeFx = createEffect((theme: Theme) => {
    if (ThemeSchema.safeParse(theme).success) {
      document.documentElement.setAttribute("data-theme", theme)
    }
  })
  const getThemeFx = createEffect(() => {
    const theme = getCookie("theme")
    if (ThemeSchema.safeParse(theme).success) {
      return theme
    }
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const preferredTheme = isDark ? "dark" : "light"

    return preferredTheme
  })
  sample({
    clock: init,
    target: getThemeFx,
  })
  sample({
    clock: getThemeFx.doneData,
    filter: (theme) => ThemeSchema.safeParse(theme).success,
    fn: (theme) => theme as Theme,
    target: [$theme, initThemeFx],
  })
  sample({
    clock: changeThemeFx.done,
    fn: ({ params }) => params,
    target: $theme,
  })
  sample({
    clock: themeChanged,
    target: changeThemeFx,
  })
  return {
    $theme,
    themeChanged,
    init,
  }
})
