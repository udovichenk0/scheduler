import { createEvent, createStore, sample, createEffect } from "effector"
import { z } from "zod"

import { singleton } from "@/shared/lib/effector/singleton"
import { parseCookieValue, setCookie } from "@/shared/lib/storage"
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

export const $$accentSettings = singleton(() => {
  const init = createEvent()
  const accentChanged = createEvent<Accent>()

  const $accent = createStore<Accent>("blue")

  const changeAccentFx = createEffect((accent: Accent) => {
    if (AccentSchema.safeParse(accent).success) {
      document.documentElement.style.setProperty("--accent", `var(--${accent})`)
      setCookie("accent", accent)
    }
  })
  const getAccentFx = createEffect(() => {
    const accent = parseCookieValue("accent")
    if (AccentSchema.safeParse(accent).success) {
      return accent as Accent
    }
    return "blue"
  })
  const initAccentFx = createEffect(() => {
    const accent = parseCookieValue("accent")
    if (AccentSchema.safeParse(accent).success) {
      document.documentElement.style.setProperty("--accent", `var(--${accent})`)
    }
  })
  sample({
    clock: init,
    target: getAccentFx,
  })
  sample({
    clock: getAccentFx.doneData,
    target: [$accent, initAccentFx],
  })
  sample({
    clock: accentChanged,
    target: changeAccentFx,
  })
  sample({
    clock: changeAccentFx.done,
    fn: ({ params }) => params,
    target: $accent,
  })
  return {
    $accent,
    accentChanged,
    init,
  }
})
