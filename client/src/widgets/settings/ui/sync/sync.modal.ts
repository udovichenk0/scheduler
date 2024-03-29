import { createEvent, createStore, sample, split } from "effector"
import { createGate } from "effector-react"
import { not } from "patronum"

import { resetEmailTriggered } from "@/features/authentication/check-email"
import { resetSigninPasswordTriggered } from "@/features/authentication/sign-in"
import { resetSignupPasswordTriggered } from "@/features/authentication/sign-up"

import { $$session } from "@/entities/session"

import { authApi } from "@/shared/api/auth"
import { tokenService } from "@/shared/api/token"
import { userApi } from "@/shared/api/user"
import { isHttpError, isNoError } from "@/shared/lib/error"

export enum Flow {
  email = "email",
  login = "login",
  register = "register",
  options = "options",
  logout = "logout",
  verify = "verify",
}
export const flowChanged = createEvent<Flow>()
export const reset = createEvent()

export const $flow = createStore<Flow>(Flow.options)

export const gate = createGate()

sample({
  clock: gate.close,
  filter: not($$session.$isAuthenticated),
  target: reset,
})

sample({
  clock: flowChanged,
  target: $flow,
})

const notFoundError = createEvent()
const noError = createEvent()

split({
  source: userApi.getUserQuery.finished.finally,
  match: {
    isNoError: isNoError,
    isHttpError: isHttpError(404),
  },
  cases: {
    isNoError: noError,
    isHttpError: notFoundError,
  }
})
sample({
  clock: noError,
  fn: () => Flow.login,
  target: $flow,
})
sample({
  clock: notFoundError,
  fn: () => Flow.register,
  target: $flow
})

sample({
  clock: authApi.logoutQuery.finished.success,
  fiilter: Boolean,
  fn: () => Flow.email,
  target: $flow,
})
sample({
  clock: authApi.signupQuery.finished.success,
  fn: () => Flow.verify,
  target: $flow,
})
sample({
  clock: tokenService.setTokenTriggered,
  fn: () => Flow.logout,
  target: $flow,
})

sample({
  clock: reset,
  target: [
    $flow.reinit!,
    resetEmailTriggered,
    resetSigninPasswordTriggered,
    resetSignupPasswordTriggered,
  ],
})

