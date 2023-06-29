import { createEvent, createStore, sample } from "effector"
import { spread } from "patronum"
import { z } from "zod"
import { setSessionUserTriggered } from "@/entities/session/session.model"
import { signinQuery } from "@/shared/api/auth/signin"
import { setTokenTriggered } from "@/shared/api/token"
import { $email } from "../by-email"

export const passwordChanged = createEvent<string>()
export const submitTriggered = createEvent()
export const resetSigninPasswordTriggered = createEvent()

export const $password = createStore('')
export const $passwordError = createStore<'invalid_password' |  null>(null)

const signinSchema = z.string().trim()

sample({
  clock: passwordChanged,
  target: $password
})

sample({
  clock: passwordChanged,
  target: $password
})
sample({
  clock: submitTriggered,
  source: {email: $email,password: $password},
  filter: ({password}) => signinSchema.safeParse(password).success,
  target: signinQuery.start
})

sample({
  clock: resetSigninPasswordTriggered,
  target: [$passwordError.reinit, $password.reinit]
})

sample({
  clock: signinQuery.finished.success,
  fn: ({result}) => ({
    user: result.user,
    token: result.access_token,
  }),
  target: spread({
    targets: {
      user: setSessionUserTriggered,
      token: setTokenTriggered,
    }
  })
})


sample({
  clock: signinQuery.finished.failure,
  fn: () => 'invalid_password' as const,
  target: $passwordError
})