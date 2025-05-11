import { createEvent, createStore, sample, split } from "effector"
import { createGate } from "effector-react"
import { not } from "patronum"

import { resetEmailTriggered } from "@/features/authentication/check-email/model.ts"
import { resetSigninPasswordTriggered } from "@/features/authentication/sign-in/signin.model.ts"
import { resetSignupPasswordTriggered } from "@/features/authentication/sign-up/signup.model.ts"

import { $$session } from "@/entities/session/session.model.ts"

import { authApi } from "@/shared/api/auth/auth.api.ts"
import { prepend } from "@/shared/lib/effector/prepend.ts"

export enum Flow {
  email = "email",
  login = "login",
  register = "register",
  options = "options",
  logout = "logout",
  verify = "verify",
}
export const flowChanged = createEvent<Flow>()
const reset = createEvent()

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
