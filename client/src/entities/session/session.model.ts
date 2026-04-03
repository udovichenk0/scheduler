import { createEvent, createStore, sample } from "effector"

import { singleton } from "@/shared/lib/effector/singleton"
import { authApi } from "@/shared/api/auth/auth.api.ts"

import { User } from "./type"
import { invitationSseClient } from "@/shared/lib/sse"

export const $$session = singleton(() => {
  const sessionSet = createEvent<User>()
  const reset = createEvent()
  const init = createEvent()

  const $user = createStore<Nullable<User>>(null)

  const $isAuthenticated = createStore(false)

  sample({
    clock: sessionSet,
    target: $user,
  })
  sample({
    clock: sessionSet,
    fn: () => true,
    target: [$isAuthenticated],
  })
  sample({
    clock: reset,
    target: [$user.reinit, $isAuthenticated.reinit],
  })

  sample({
    clock: init,
    target: authApi.checkSession.start,
  })

  sample({
    clock: authApi.checkSession.finished.success,
    fn: (r) => r.result,
    target: sessionSet,
  })

  sample({
    clock: authApi.checkSession.finished.success,
    fn: (r) => r.result.id,
    target: invitationSseClient.connectFx,
  })

  return {
    $user,
    $isAuthenticated,
    reset,
    sessionSet,
    init,
  }
})
