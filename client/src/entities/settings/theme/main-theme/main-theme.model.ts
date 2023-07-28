import { zodContract } from "@farfetched/zod"
import { createEvent, createStore, sample } from "effector"
import { createEffect } from "effector/effector.umd"
import { persist } from "effector-storage/local"
import { z } from "zod"

const ThemeSchema = z.enum(["space", "default", "dark", "light", "grey"])

type Theme = z.infer<typeof ThemeSchema>
export const themeChanged = createEvent<Theme>()

export const $theme = createStore<Theme>("default")

const changeDateThemeFx = createEffect((theme: Theme) => {
  document.documentElement.setAttribute("data-theme", theme)
})

persist({
  store: $theme,
  key: "data-theme",
  contract: zodContract(ThemeSchema),
})
sample({
  clock: themeChanged,
  target: [$theme, changeDateThemeFx],
})
