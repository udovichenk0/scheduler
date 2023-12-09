import { createEvent, createStore, sample } from "effector"

import { tokenApi } from "@/shared/api/token"
import { singleton } from "@/shared/lib/effector/singleton"

import { User } from "./type"

export const $$session = singleton(() => {
  const sessionSet = createEvent<User>()
  const reset = createEvent()
  const $user = createStore<Nullable<User>>(null)
  sample({
    clock: tokenApi.refreshQuery.finished.success,
    fn: ({ result }) => result.user,
    target: sessionSet,
  })
  const $isAuthenticated = createStore(false)
  sample({
    clock: sessionSet,
    target: $user,
  })
  sample({
    clock: sessionSet,
    fn: () => true,
    target: $isAuthenticated,
  })
  sample({
    clock: reset,
    target: [$user.reinit, $isAuthenticated.reinit],
  })

  return {
    $user,
    $isAuthenticated,
    reset,
    sessionSet,
  }
})
