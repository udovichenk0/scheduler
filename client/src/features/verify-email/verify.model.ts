import { createEvent, createStore, sample, split } from "effector"
import { interval, equals } from "patronum"
import { createGate } from "effector-react"
import { t } from "i18next"

import { $$session } from "@/entities/session"

import { UNEXPECTED_ERROR_MESSAGE, isHttpError } from "@/shared/lib/error"
import { authApi } from "@/shared/api/auth"
import { prepend } from "@/shared/lib/effector"

import { resetEmailTriggered } from "../authentication/check-email"

import { INVALID_CODE_MESSAGE } from "./constants"
const RESEND_TIME = 10
export const CODE_LENGTH = 6
export const codeChanged = createEvent<string>()
export const submitTriggered = createEvent()
export const resent = createEvent()

export const $code = createStore<Nullable<string>>(null)
export const $error = createStore<Nullable<string>>(null)
export const $time = createStore(RESEND_TIME)

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
  target: timerStarted,
})
export const { tick, isRunning: $isRunning } = interval({
  timeout: 1000,
  start: timerStarted,
  stop: timerStopped,
})
sample({
  clock: tick,
  source: $time,
  fn: (time) => time - 1,
  target: $time,
})
sample({
  clock: $time,
  filter: equals($time, 0),
  target: timerStopped,
})

sample({
  clock: submitTriggered,
  source: { code: $code, session: $$session.$user },
  filter: ({ code, session }) => !!code && !!session?.id,
  fn: ({ code, session }) => ({ code: code!, userId: session!.id }),
  target: authApi.verifyEmailQuery.start,
})

sample({
  clock: authApi.verifyEmailQuery.finished.success,
  target: resetEmailTriggered,
})

split({
  source: authApi.verifyEmailQuery.finished.failure,
  match: {
    invalidCode: isHttpError(400),
  },
  cases: {
    invalidCode: prepend<Nullable<string>, void>(
      $error,
      t(INVALID_CODE_MESSAGE),
    ),
    __: prepend<Nullable<string>, void>($error, t(UNEXPECTED_ERROR_MESSAGE)),
  },
})

sample({
  clock: FormGate.close,
  target: resetVerifyTriggered,
})

sample({
  clock: resent,
  source: $$session.$user,
  filter: Boolean,
  fn: ({ id, email }) => ({ userId: id, email }),
  target: authApi.resendCodeQuery.start,
})

sample({
  clock: authApi.resendCodeQuery.finished.success,
  target: [resetVerifyTriggered, timerStarted],
})

sample({
  clock: authApi.resendCodeQuery.finished.finally,
  fn: () => RESEND_TIME,
  target: [$time, timerStarted],
})

sample({
  clock: resetVerifyTriggered,
  target: [$time.reinit, $error.reinit],
})
