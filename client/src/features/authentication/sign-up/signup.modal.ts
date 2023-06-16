import { createEvent, createStore, sample } from "effector"
import { spread } from "patronum"
import { z } from "zod"
import { setSessionUserTriggered } from "@/entities/session/session.model"
import { signupQuery } from "@/shared/api/auth/signup"
import { setTokenTriggered } from "@/shared/api/token"
import { $email } from "../by-email"

export const passwordChanged = createEvent<string>()
export const submitTriggered = createEvent()
export const resetTriggered = createEvent()

export const $password = createStore('')
export const $passwordError = createStore<'too_small' | 'invalid_string' |  null>(null)

const signupSchema = z.string().min(8)   

sample({
  clock: submitTriggered,
  source: {email: $email,password: $password},
  filter: ({password}) => signupSchema.safeParse(password).success,
  target: signupQuery.start
})

sample({
  clock: passwordChanged,
  target: $password
})
sample({
  clock: signupQuery.finished.success,
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