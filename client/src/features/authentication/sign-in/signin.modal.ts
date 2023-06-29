import { createEvent, createStore, sample } from "effector"
import { spread } from "patronum"
import { z } from "zod"
import { setSessionUserTriggered } from "@/entities/session/session.model"
import { signinQuery } from "@/shared/api/auth/signin"
import { setTokenTriggered } from "@/shared/api/token"
import { $email } from "../by-email"
import { MAX_LENGTH, NOT_VALID_ERROR, TOO_LONG_ERROR } from "./constants"

export const passwordChanged = createEvent<string>()
export const submitTriggered = createEvent()
export const resetSigninPasswordTriggered = createEvent()

export const $password = createStore('')
export const $passwordError = createStore<'invalid_string' | 'too_long' |  null>(null)

const signinSchema = z.string().trim().max(50)

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
  clock: submitTriggered,
  source: $password,
  filter: (password) => !signinSchema.safeParse(password).success,
  fn: checkError,
  target: $passwordError
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
  fn: () => NOT_VALID_ERROR,
  target: $passwordError
})

function checkError(value:string){
  if(value.length > MAX_LENGTH){
    return TOO_LONG_ERROR
  }
  else {
    return NOT_VALID_ERROR
  }
}
