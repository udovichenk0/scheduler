import { attach, createEffect, createEvent, sample } from "effector"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { RouteInstance } from "atomic-router"

import { singleton } from "../lib/effector/singleton"
import { router, routes } from "../routing"

import ukLocale from "./locales/uk.json"
import enLocale from "./locales/en.json"
const $$i18n = singleton(() => {
  const init = createEvent()
  const setupI18nFx = createEffect(() => {
    i18n
      .use(initReactI18next)
      .use(LanguageDetector)
      .init({
        debug: true,
        fallbackLng: "en",
        detection: {
          order: ["path", "cookie"],
          lookupQuerystring: "lang",
          lookupCookie: "lang",
          caches: ['localStorage', 'cookie'],
          excludeCacheFor: ['cimode'],
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
      lang: string,
    ) => {
      await i18n.changeLanguage(lang)
      const curRoute = activeRoutes[0]
      curRoute.navigate({
        params: { lang: lang === "en" ? undefined : lang },
        query: {},
        replace: true,
      })
      return lang
    },
  })

  sample({
    clock: init,
    target: setupI18nFx,
  })
  //mega costul`
  sample({
    clock: init,
    source: router.$activeRoutes,
    target: createEffect((activeRoutes: RouteInstance<any>[]) => {
      const curRoute = activeRoutes[0]
      const lngFromUrl = window.location.pathname.split("/")[1]
      const isTrailingSlashAfterLocale = window.location.pathname.split("/")[2]
      //if its home route and locale doesn't have trailing slash then set it
      if (
        (i18n.options.supportedLngs as string[]).includes(lngFromUrl) &&
        i18n.language !== (i18n.options.fallbackLng as string[])[0] &&
        !isTrailingSlashAfterLocale
      ) {
        routes.home.navigate({
          params: { lang: "uk" },
          query: {},
          replace: true,
        })
      }
      // if fallback language remove locale from url
      if (lngFromUrl == (i18n.options.fallbackLng as string[])[0]) {
        curRoute.navigate({
          params: { lang: undefined },
          query: {},
          replace: true,
        })
      }
      // if no locale in url and its not fallback one, set from localstorage to url
      if (
        !(i18n.options.supportedLngs as string[]).includes(lngFromUrl) &&
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

export { $$i18n, i18n }
