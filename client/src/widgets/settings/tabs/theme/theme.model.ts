import { zodContract } from "@farfetched/zod";
import { createEvent, createStore, sample, createEffect } from "effector";
import { persist } from 'effector-storage/session'
import { z } from 'zod'
const themeSchema = z.enum(['space', 'default', 'dark', 'light', 'grey'])
const accentSchema = z.enum(['blue', 'yellow', 'green', 'red', 'orange', 'purple', 'pink'])

type Theme = z.infer<typeof themeSchema>
type Accent = z.infer<typeof accentSchema>

export const themeChanged = createEvent<Theme>()
export const accentChanged = createEvent<Accent>()

export const $theme = createStore<Theme>('space')
export const $accent = createStore<Accent>('blue')

sample({
  clock: themeChanged,
  target: $theme
})
sample({
  clock: accentChanged,
  target: $accent
})

persist({
  source: $theme,
  key: 'theme',
  contract: zodContract(themeSchema),
  target: createEffect((theme:Theme) => {
    document.documentElement.setAttribute('data-theme', theme)
  })
})

persist({
  source: $accent,
  key: 'accent',
  contract: zodContract(accentSchema),
  target: createEffect((accent: Accent) => {
    document.documentElement.style.setProperty('--accent', `var(--${accent})`)
  })
})