import {
  StoreWritable,
  createEvent,
  attach,
  createEffect,
  sample,
  createStore,
} from "effector"
import { combineEvents, not } from "patronum"
import { z } from "zod"

import { prepend } from "../effector"

import { getCookie } from "./get-cookie"

export const cookiePersist = <T>({
  source,
  name,
  schema,
}: {
  source: StoreWritable<T>
  name: string
  schema: z.Schema<T, z.ZodTypeDef, string>
}) => {
  const init = createEvent()
  const $isInited = createStore(false)

  const getFx = attach({
    effect: createEffect(async () => {
      const value = getCookie(name)
      const a = schema.safeParse(value)
      if (a.success) {
        return a.data
      }
      throw Error(a.error.message)
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
    filter: not($isInited),
    target: [getFx, prepend($isInited, true)],
  })

  sample({
    clock: getFx.doneData,
    target: source,
  })
  sample({
    clock: getFx.fail,
    fn: ({ error }) => console.log(error),
  })

  sample({
    clock: combineEvents({ events: [init, getFx.done] }),
    source,
    target: setFx,
  })

  return init
}
