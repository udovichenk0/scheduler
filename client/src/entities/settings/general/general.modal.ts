import { createEvent, createStore, sample } from "effector"
import { createEffect } from "effector/effector.mjs"

import { $$i18n } from "@/shared/i18n"
import { parseCookieValue } from "@/shared/lib/storage"

import { languageKv } from "./config"

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
  fn: (lang) => languageKv[lang],
  target: $currentLanguage,
})

init()
