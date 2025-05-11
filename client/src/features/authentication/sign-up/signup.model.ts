import { createEvent, createStore, sample } from "effector"
import * as z from "@zod/mini"

import { $$session } from "@/entities/session/session.model.ts"

import { authApi } from "@/shared/api/auth/auth.api.ts"
import { bridge } from "@/shared/lib/effector/bridge"
import { UNEXPECTED_ERROR_MESSAGE } from "@/shared/lib/error"

import { $email } from "../check-email/model.ts"

import {
  MAX_LENGTH,
  MIN_LENGTH,
  NOT_VALID_MESSAGE,
  TOO_LONG_MESSAGE,
  TOO_SHORT_MESSAGE,
} from "./constants"

export const passwordChanged = createEvent<string>()
export const submitTriggered = createEvent()
export const resetSignupPasswordTriggered = createEvent()

export const $password = createStore("").on(
  passwordChanged,
  (_, password) => password,
)

export const $error = createStore<string>("")

const signupSchema = z.string().check(z.minLength(8), z.maxLength(50), z.trim())

bridge(() => {
  sample({
    clock: submitTriggered,
    source: { email: $email, password: $password },
    filter: ({ password }) => signupSchema.safeParse(password).success,
    target: authApi.signUp.start,
  })
  sample({
    clock: authApi.signUp.finished.success,
    fn: ({ result }) => result,
    target: [$$session.$user],
  })

  sample({
    clock: authApi.signUp.finished.failure,
    fn: () => UNEXPECTED_ERROR_MESSAGE,
    target: $error,
  })

  sample({
    clock: submitTriggered,
    source: $password,
    filter: (password) => !signupSchema.safeParse(password).success,
    fn: checkError,
    target: $error,
  })
})

sample({
  clock: resetSignupPasswordTriggered,
  target: [$error.reinit, $password.reinit],
})

function checkError(value: string) {
  if (value.length < MIN_LENGTH) {
    return TOO_SHORT_MESSAGE
  }
  if (value.length > MAX_LENGTH) {
    return TOO_LONG_MESSAGE
  }
  return NOT_VALID_MESSAGE
}
