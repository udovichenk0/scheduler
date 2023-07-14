import { zodContract } from "@farfetched/zod";
import { createEvent, createStore, sample, createEffect } from "effector";
import { persist } from 'effector-storage/local'
import { debug } from "patronum";
import { z } from 'zod'
const AccentSchema = z.enum(['blue', 'yellow', 'green', 'red', 'orange', 'purple', 'pink'])

type Accent = z.infer<typeof AccentSchema>

export const accentChanged = createEvent<Accent>()

export const $accent = createStore<Accent>('blue')

sample({
  clock: accentChanged,
  target: $accent
})

const changeDateAccentFx = createEffect((accent: Accent) => {
  document.documentElement.setAttribute('data-accent', accent)
})

debug($accent)

persist({
  store: $accent,
  key: 'data-accent',
  contract: zodContract(AccentSchema),
})
sample({
  clock: accentChanged,
  target: [$accent, changeDateAccentFx]
})
