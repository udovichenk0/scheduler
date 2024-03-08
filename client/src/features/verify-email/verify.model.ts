import { createEvent, createStore, sample, split } from "effector"
import { interval, spread, equals } from "patronum"
import { createGate } from "effector-react"
import { t } from "i18next"

import { $$session } from "@/entities/session"

import { authApi } from "@/shared/api/auth"
import { tokenService } from "@/shared/api/token"
import { bridge } from "@/shared/lib/effector"
import { UNEXPECTED_ERROR_MESSAGE, isHttpError } from "@/shared/lib/error"

import { $email, resetEmailTriggered } from "../authentication/check-email"

import { INVALID_CODE_MESSAGE } from "./constants"
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
    user: $$session.sessionSet,
    token: tokenService.setTokenTriggered,
  }),
})
sample({
  clock: authApi.verifyQuery.finished.success,
  target: resetEmailTriggered
})

const invalidCodeError = createEvent()
const unexpectedError = createEvent()
split({
  source: authApi.verifyQuery.finished.failure,
  match: {
    invalidCode: isHttpError(400),
  },
  cases: {
    invalidCode: invalidCodeError,
    __: unexpectedError
  }
})
sample({
  clock: invalidCodeError,
  fn: () => t(INVALID_CODE_MESSAGE),
  target: $error
})

sample({
  clock: unexpectedError,
  fn: () => t(UNEXPECTED_ERROR_MESSAGE),
  target: $error
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
  target: [$time.reinit, timerStopped, $error.reinit]
})