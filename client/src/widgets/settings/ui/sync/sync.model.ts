import { createEvent, createStore, sample, split } from "effector"
import { createGate } from "effector-react"
import { not } from "patronum"

import { resetEmailTriggered } from "@/features/authentication/check-email"
import { resetSigninPasswordTriggered } from "@/features/authentication/sign-in"
import { resetSignupPasswordTriggered } from "@/features/authentication/sign-up"

import { $$session } from "@/entities/session"

import { authApi } from "@/shared/api/auth"
import { prepend } from "@/shared/lib/effector"

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

split({
  source: authApi.checkVerifiedEmailExists.finished.success,
  match: {
    signin: (r) => r.result.exists,
    signup: (r) => !r.result.exists,
  },
  cases: {
    signin: prepend<Flow, void>($flow, Flow.login),
    signup: prepend<Flow, void>($flow, Flow.register),
  },
})

sample({
  clock: authApi.signOut.finished.success,
  fn: () => Flow.email,
  target: $flow,
})

sample({
  clock: authApi.signUp.finished.success,
  fn: () => Flow.verify,
  target: $flow,
})

sample({
  clock: [
    authApi.checkSession.finished.success,
    authApi.signIn.finished.success,
  ],
  fn: () => Flow.logout,
  target: $flow,
})

sample({
  clock: authApi.verifyEmailQuery.finished.success,
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
