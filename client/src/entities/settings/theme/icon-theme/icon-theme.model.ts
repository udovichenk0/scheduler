import { createEvent, createStore, sample, createEffect } from "effector"
import { z } from "zod"

import { cookiePersist } from "@/shared/lib/cookie-persist"
const AccentSchema = z.enum([
  "blue",
  "yellow",
  "green",
  "red",
  "orange",
  "purple",
  "pink",
])

export type Accent = z.infer<typeof AccentSchema>

export const accentChanged = createEvent<Accent>()

export const $accent = createStore<Accent>("blue")

const changeDateAccentFx = createEffect((accent: Accent) => {
  document.documentElement.style.setProperty("--accent", `var(--${accent})`)
})

sample({
  clock: accentChanged,
  target: [$accent, changeDateAccentFx],
})

cookiePersist({
  source: $accent,
  name: "accent",
})
