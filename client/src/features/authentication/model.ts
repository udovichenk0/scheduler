import { createEvent, createStore, sample } from "effector"
import { createGate } from "effector-react"
import { not } from "patronum"

import { $isAuthenticated } from "@/entities/session"

import { logoutQuery, signinQuery, signupQuery } from "@/shared/api/auth"
import { setTokenTriggered } from "@/shared/api/token"
import { getUserQuery } from "@/shared/api/user"

import { resetEmailTriggered } from "./by-email"
import { resetSigninPasswordTriggered } from "./sign-in"
import { resetSignupPasswordTriggered } from "./sign-up"

export enum Flow {
  email = "email",
  login = "login",
  register = "register",
  options = "options",
  logout = "logout",
}
export const flowChanged = createEvent<Flow>()
export const reset = createEvent()

export const $flow = createStore<Flow>(Flow.options)

export const gate = createGate()

sample({
  clock: gate.close,
  filter: not($isAuthenticated),
  target: reset,
})

sample({
  clock: flowChanged,
  target: $flow,
})

sample({
  clock: getUserQuery.finished.success,
  filter: ({ result }) => !result.id,
  fn: () => Flow.register,
  target: $flow,
})

sample({
  clock: getUserQuery.finished.success,
  filter: ({ result }) => Boolean(result.id),
  fn: () => Flow.login,
  target: $flow,
})

sample({
  clock: logoutQuery.finished.success,
  fiilter: Boolean,
  fn: () => Flow.email,
  target: $flow,
})

sample({
  clock: [
    signinQuery.finished.success,
    signupQuery.finished.success,
    setTokenTriggered,
  ],
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
