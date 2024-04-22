import { createEvent, createStore, sample } from "effector"
import { z } from "zod"

import { authApi } from "@/shared/api/auth"
import { bridge } from "@/shared/lib/effector/bridge"

import { $email } from "../check-email"

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

export const $passwordError = createStore<string>("")

const signupSchema = z.string().min(8).max(50).trim()

bridge(() => {
  sample({
    clock: submitTriggered,
    source: { email: $email, password: $password },
    filter: ({ password }) => signupSchema.safeParse(password).success,
    target: authApi.signupQuery.start,
  })

  sample({
    clock: submitTriggered,
    source: $password,
    filter: (password) => !signupSchema.safeParse(password).success,
    fn: checkError,
    target: $passwordError,
  })
})

sample({
  clock: resetSignupPasswordTriggered,
  target: [$passwordError.reinit, $password.reinit],
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
