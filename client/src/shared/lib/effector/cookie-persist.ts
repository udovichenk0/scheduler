import { Store, createEvent, attach, createEffect, sample } from "effector"
import { combineEvents } from "patronum"

import { parseCookieValue } from "../storage/parse-cookie-value"

export const cookiePersist = <T>({
  source,
  name,
}: {
  source: Store<T>
  name: string
}) => {
  const init = createEvent<string>()
  const getFx = attach({
    effect: createEffect(async (cookieName: string | number | boolean) => {
      return parseCookieValue(cookieName) as T
    }),
  })
  const setFx = attach({
    effect: createEffect(async (cookieValue: T) => {
      document.cookie = `${name}=${cookieValue};path=/`
    }),
  })

  sample({
    clock: source,
    target: setFx,
  })

  sample({
    clock: init,
    target: getFx,
  })

  sample({
    clock: getFx.doneData,
    filter: Boolean,
    target: source,
  })
  sample({
    clock: combineEvents({ events: [init, getFx.done] }),
    source,
    target: setFx,
  })

  init(name)
}
