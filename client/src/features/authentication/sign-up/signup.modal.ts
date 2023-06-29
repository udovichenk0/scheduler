import { createEvent, createStore, sample } from "effector"
import { spread } from "patronum"
import { z } from "zod"
import { setSessionUserTriggered } from "@/entities/session/session.model"
import { signupQuery } from "@/shared/api/auth/signup"
import { setTokenTriggered } from "@/shared/api/token"
import { $email } from "../by-email"
import { MAX_LENGTH, MIN_LENGTH } from "./constants"

export const passwordChanged = createEvent<string>()
export const submitTriggered = createEvent()
export const resetSignupPasswordTriggered = createEvent()

export const $password = createStore('')
export const $passwordError = createStore<'too_small' | 'too_long' | 'invalid_string' |  null>(null)

const signupSchema = z.string().min(8).max(50).trim()

sample({
  clock: submitTriggered,
  source: {email: $email,password: $password},
  filter: ({password}) => signupSchema.safeParse(password).success,
  target: signupQuery.start
})

sample({
  clock: submitTriggered,
  source: $password,
  filter: (password) => !signupSchema.safeParse(password).success,
  fn: checkError,
  target: $passwordError
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

sample({
  clock: resetSignupPasswordTriggered,
  target: [$passwordError.reinit, $password.reinit]
})

function checkError(value: string) {
  if(value.length < MIN_LENGTH){
    return 'too_small'
  }
  if(value.length > MAX_LENGTH){
    return 'too_long'
  }
  return 'invalid_string'
}