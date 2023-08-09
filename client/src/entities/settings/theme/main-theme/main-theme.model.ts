import { createEvent, createStore, sample } from "effector"
import { createEffect } from "effector/effector.umd"
import { z } from "zod"

import { cookiePersist } from "@/shared/lib/cookie-persist"
const ThemeContract = z.enum(["space", "default", "dark", "light", "grey"])

export type Theme = z.infer<typeof ThemeContract>
export const themeChanged = createEvent<Theme>()

export const $theme = createStore<Theme>("default")

const changeDateThemeFx = createEffect((theme: Theme) => {
  if (theme) {
    document.documentElement.setAttribute("data-theme", theme)
  }
})
sample({
  clock: themeChanged,
  target: [$theme, changeDateThemeFx],
})

cookiePersist({
  source: $theme,
  name: "theme",
})
