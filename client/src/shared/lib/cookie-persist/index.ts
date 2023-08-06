import { Store, createEvent, attach, createEffect, sample } from "effector"
import { combineEvents } from "patronum"

import { parseCookieValue } from "../parse-cookie-value"

export const cookiePersist = ({
  source,
  name,
}: {
  source: Store<any>
  name: string
}) => {
  const init = createEvent<string>()
  const getFx = attach({
    effect: createEffect(async (cookieName: string | number | boolean) => {
      return parseCookieValue(cookieName)
    }),
  })
  const setFx = attach({
    effect: createEffect(async (cookieValue: string | number | boolean) => {
      document.cookie = `${name}=${cookieValue}`
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
