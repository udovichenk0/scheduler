import { createEvent, createStore, sample, split } from "effector"
import { spread } from "patronum"
import { z } from "zod"
import { t } from "i18next"

import { $$session } from "@/entities/session"

import { authApi } from "@/shared/api/auth"
import { tokenService } from "@/shared/api/token"
import { bridge } from "@/shared/lib/effector/bridge"
import { UNEXPECTED_ERROR_MESSAGE, isHttpError } from "@/shared/lib/error"

import { $email, resetEmailTriggered } from "../check-email"

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
export const $passwordError = createStore<Nullable<string>>(null)

const signinSchema = z.string().trim().min(MIN_LENGTH).max(MAX_LENGTH)

bridge(() => {
  sample({
    clock: submitTriggered,
    source: { email: $email, password: $password },
    filter: ({ password }) => {
      return signinSchema.safeParse(password).success
    },
    target: authApi.signinQuery.start,
  })
  sample({
    clock: submitTriggered,
    source: $password,
    filter: (password) => !signinSchema.safeParse(password).success,
    fn: checkError,
    target: $passwordError,
  })
})

bridge(() => {
  sample({
    clock: authApi.signinQuery.finished.success,
    fn: ({ result }) => ({
      user: result.user,
      token: result.access_token,
    }),
    target: spread({
      user: $$session.sessionSet,
      token: tokenService.setTokenTriggered,
    }),
  })

  const wrongPassword = createEvent()
  const internalError = createEvent()
  split({
    source: authApi.signinQuery.finished.failure,
    match: {
      isWrongPassword: isHttpError(400),
    },
    cases: {
      isWrongPassword: wrongPassword,
      __: internalError,
    },
  })

  sample({
    clock: wrongPassword,
    fn: () => t(INVALID_PASSWORD_MESSAGE),
    target: $passwordError,
  })

  sample({
    clock: internalError,
    fn: () => t(UNEXPECTED_ERROR_MESSAGE),
    target: $passwordError,
  })
})

sample({
  clock: resetSigninPasswordTriggered,
  target: [$passwordError.reinit, $password.reinit, resetEmailTriggered],
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
