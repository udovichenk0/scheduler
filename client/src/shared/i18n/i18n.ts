import { attach, createEffect, createEvent, sample } from "effector"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { RouteInstance } from "atomic-router"

import { singleton } from "../lib/singleton"
import { router } from "../routing"

import ukLocale from "./locales/uk.json"
import enLocale from "./locales/en.json"
export const $$i18n = singleton(() => {
  const init = createEvent()
  const setupI18nFx = createEffect(() => {
    i18n
      .use(initReactI18next)
      .use(LanguageDetector)
      .init({
        debug: true,
        fallbackLng: "en",
        detection: {
          order: ["path", "localStorage"],
          lookupQuerystring: "lang",
        },
        supportedLngs: ["en", "uk"],
        resources: {
          uk: {
            translation: ukLocale,
          },
          en: {
            translation: enLocale,
          },
        },
      })
  })
  const changeLanguageFx = attach({
    source: router.$activeRoutes,
    effect: async (
      activeRoutes: RouteInstance<any>[],
      { lang }: { lang: string },
    ) => {
      await i18n.changeLanguage(lang)
      const curRoute = activeRoutes[0]
      curRoute.navigate({
        params: { lang: lang === "en" ? undefined : lang },
        query: {},
        replace: true,
      })
    },
  })

  sample({
    clock: init,
    target: setupI18nFx,
  })

  sample({
    clock: init,
    source: router.$activeRoutes,
    target: createEffect((routes: RouteInstance<any>[]) => {
      const curRoute = routes[0]
      const pathname = window.location.pathname.split("/")[1]
      if (pathname == (i18n.options.fallbackLng as string[])[0]) {
        curRoute.navigate({
          params: { lang: undefined },
          query: {},
          replace: true,
        })
      }
      if (
        !(i18n.options.supportedLngs as string[]).includes(pathname) &&
        i18n.language !== (i18n.options.fallbackLng as string[])[0]
      ) {
        curRoute.navigate({
          params: { lang: i18n.language },
          query: {},
          replace: true,
        })
      }
    }),
  })
  return {
    i18n,
    init,
    changeLanguageFx,
  }
})
