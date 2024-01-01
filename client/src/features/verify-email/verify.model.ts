import { createEvent, createStore, sample } from "effector"
import { interval, spread, equals } from "patronum"
import { createGate } from "effector-react"

import { $$session } from "@/entities/session"

import { authApi } from "@/shared/api/auth"
import { tokenService } from "@/shared/api/token"
import { bridge } from "@/shared/lib/effector"

import { $email } from "../authentication/check-email"
export const CODE_LENGTH = 6
export const codeChanged = createEvent<string>()
export const submitTriggered = createEvent()
export const resent = createEvent()

export const $code = createStore<Nullable<string>>(null)
export const $error = createStore<Nullable<string>>(null)
export const $time = createStore(10)

export const resetVerifyTriggered = createEvent()
const timerStarted = createEvent()
const timerStopped = createEvent()

export const FormGate = createGate()

sample({
  clock: codeChanged,
  target: $code,
})
sample({
  clock: FormGate.open,
  target: timerStarted
})
export const { tick, isRunning: $isRunning } = interval({
  timeout: 1000,
  start: timerStarted,
  stop: timerStopped
})
sample({
  clock: tick,
  source: $time,
  fn: (time) => time - 1,
  target: $time
})
sample({
  clock: $time,
  filter: equals($time, 0),
  target: timerStopped
})

sample({
  clock: submitTriggered,
  source: { code: $code, email: $email },
  filter: ({code}) => !!code,
  fn: ({ code, email }) => ({ code: code!, email }),
  target: authApi.verifyQuery.start,
})
sample({
  clock: authApi.verifyQuery.finished.success,
  fn: ({ result }) => ({
    user: result.user,
    token: result.access_token,
  }),
  target: spread({
    targets: {
      user: $$session.sessionSet,
      token: tokenService.setTokenTriggered,
    },
  }),
})
sample({
  clock: FormGate.close,
  target: resetVerifyTriggered
})
bridge(() => {
  sample({
    clock: resent,
    source: $email,
    filter: Boolean, 
    target: authApi.resendCodeQuery.start
  })
  
  sample({
    clock: authApi.resendCodeQuery.finished.success,
    target: [resetVerifyTriggered, timerStarted]
  })
})

sample({
  clock: resetVerifyTriggered,
  target: $time.reinit, timerStopped
})