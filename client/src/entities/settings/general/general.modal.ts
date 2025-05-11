import { createEvent, createStore, sample, createEffect } from "effector"

import { $$i18n } from "@/shared/i18n/i18n.ts"
import { parseCookieValue } from "@/shared/lib/storage/parse-cookie-value.ts"

import { languages } from "./config"

export const init = createEvent()
export const $currentLanguage = createStore("")
export const languageChanged = createEvent<string>()
const getLanguageFx = createEffect(() => {
  const lang = parseCookieValue("lang") || "en"
  return lang as string
})

sample({
  clock: languageChanged,
  target: $$i18n.changeLanguageFx,
})

sample({
  clock: init,
  target: getLanguageFx,
})
sample({
  clock: [getLanguageFx.doneData, $$i18n.changeLanguageFx.doneData],
  fn: (lang) =>
    languages.find(({ value }) => value == lang)?.label || "English",
  target: $currentLanguage,
})
