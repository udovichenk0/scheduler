import { createEvent, createStore, sample } from "effector"

import { refreshQuery } from "@/shared/api/token"
import { singleton } from "@/shared/lib/singleton"

import { User } from "./type"

export const $$session = singleton(() => {
  const sessionSet = createEvent<User>()
  const reset = createEvent()
  const $user = createStore<Nullable<User>>(null)
  sample({
    clock: refreshQuery.finished.success,
    fn: ({ result }) => result.user,
    target: $user,
  })
  const $isAuthenticated = $user.map((user) => Boolean(user))
  sample({
    clock: sessionSet,
    target: $user,
  })
  sample({
    clock: reset,
    target: $user.reinit!,
  })

  return {
    $user: $user.map((user) => user),
    $isAuthenticated,
    reset,
    sessionSet,
  }
})
