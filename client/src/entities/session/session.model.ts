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
    target: $user,
  })
  const $isAuthenticated = createStore(false).on($user, (user) => !!user)
  sample({
    clock: sessionSet,
    target: $user,
  })
  sample({
    clock: reset,
    target: $user.reinit!,
  })

  return {
    $user,
    $isAuthenticated,
    reset,
    sessionSet,
  }
})
