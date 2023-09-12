import { attach, createEvent, createStore, sample } from "effector"
import { z } from "zod"

import { $$session } from "@/entities/session"

import { authApi } from "@/shared/api/auth"
import { taskApi } from "@/shared/api/task"

import { $email } from "../by-email"

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

export const $password = createStore("")
export const $passwordError = createStore<Nullable<string>>(null)

const signupSchema = z.string().min(8).max(50).trim()
const getTasksFromLsAttached = attach({
  effect: taskApi.getTasksFromLocalStorageFx,
})
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

sample({
  clock: passwordChanged,
  target: $password,
})
sample({
  clock: authApi.signupQuery.finished.success,
  target: getTasksFromLsAttached,
})
sample({
  clock: getTasksFromLsAttached.doneData,
  source: $$session.$user,
  filter: (user, data) => Boolean(user) && data.length > 0,
  fn: (user, data) => ({ body: { user_id: user!.id, tasks: data } }),
  target: taskApi.createTasks.start,
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
