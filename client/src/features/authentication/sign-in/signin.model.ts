import { createEvent, createStore, sample, split } from "effector"
import * as z from "@zod/mini"

import { $$session } from "@/entities/session/session.model.ts"

import { authApi } from "@/shared/api/auth/auth.api.ts"
import { UNEXPECTED_ERROR_MESSAGE, isHttpError } from "@/shared/lib/error"
import { bridge } from "@/shared/lib/effector/bridge.ts"
import { prepend } from "@/shared/lib/effector/prepend.ts"

import { $email, resetEmailTriggered } from "../check-email/model.ts"

import {
  MAX_LENGTH,
  MIN_LENGTH,
  INVALID_PASSWORD_MESSAGE,
  TOO_LONG_PASSWORD_MESSAGE,
  TOO_SHORT_PASSWORD_MESSAGE,
} from "./constants"

export const passwordChanged = createEvent<string>()
export const submitTriggered = createEvent()
export const resetSigninPasswordTriggered = createEvent()

export const $password = createStore<string>("").on(
  passwordChanged,
  (_, password) => password,
)
export const $error = createStore<Nullable<string>>(null)

const signinSchema = z
  .string()
  .check(z.trim(), z.minLength(MIN_LENGTH), z.maxLength(MAX_LENGTH))

bridge(() => {
  sample({
    clock: submitTriggered,
    source: { email: $email, password: $password },
    filter: ({ password }) => signinSchema.safeParse(password).success,
    target: authApi.signIn.start,
  })
  sample({
    clock: submitTriggered,
    source: $password,
    filter: (password) => !signinSchema.safeParse(password).success,
    fn: checkError,
    target: $error,
  })
})

sample({
  clock: authApi.signIn.finished.success,
  fn: ({ result }) => result,
  target: [$$session.sessionSet, resetSigninPasswordTriggered],
})

split({
  source: authApi.signIn.finished.failure,
  match: {
    isWrongPassword: isHttpError(400),
  },
  cases: {
    isWrongPassword: prepend<Nullable<string>, void>(
      $error,
      INVALID_PASSWORD_MESSAGE,
    ),
    __: prepend<Nullable<string>, void>($error, UNEXPECTED_ERROR_MESSAGE),
  },
})

sample({
  clock: resetSigninPasswordTriggered,
  target: [$error.reinit, $password.reinit, resetEmailTriggered],
})

function checkError(value: Nullable<string>) {
  if (!value || value.length < MIN_LENGTH) {
    return TOO_SHORT_PASSWORD_MESSAGE
  }
  if (value.length > MAX_LENGTH) {
    return TOO_LONG_PASSWORD_MESSAGE
  }
  return INVALID_PASSWORD_MESSAGE
}
