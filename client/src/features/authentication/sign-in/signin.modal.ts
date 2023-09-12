import { attach, createEvent, createStore, sample } from "effector"
import { spread } from "patronum"
import { z } from "zod"

import { $$session } from "@/entities/session"
import { $$task } from "@/entities/task/task-item"

import { signinQuery } from "@/shared/api/auth"
import { setTokenTriggered } from "@/shared/api/token"
import { createManyTasksQuery, getTasksFromLsFx } from "@/shared/api/task"

import { $email } from "../by-email"

import { MAX_LENGTH, NOT_VALID_MESSAGE, TOO_LONG_MESSAGE } from "./constants"

export const passwordChanged = createEvent<string>()
export const submitTriggered = createEvent()
export const resetSigninPasswordTriggered = createEvent()

export const $password = createStore("")
export const $passwordError = createStore<Nullable<string>>(null)

const signinSchema = z.string().trim().max(50)

sample({
  clock: passwordChanged,
  target: $password,
})

sample({
  clock: passwordChanged,
  target: $password,
})
sample({
  clock: submitTriggered,
  source: { email: $email, password: $password },
  filter: ({ password }) => signinSchema.safeParse(password).success,
  target: signinQuery.start,
})

sample({
  clock: submitTriggered,
  source: $password,
  filter: (password) => !signinSchema.safeParse(password).success,
  fn: checkError,
  target: $passwordError,
})

sample({
  clock: resetSigninPasswordTriggered,
  target: [$passwordError.reinit, $password.reinit],
})
sample({
  clock: signinQuery.finished.success,
  fn: () => console.log("success"),
})
sample({
  clock: signinQuery.finished.success,
  fn: ({ result }) => ({
    user: result.user,
    token: result.access_token,
  }),
  target: spread({
    targets: {
      user: $$session.sessionSet,
      token: setTokenTriggered,
    },
  }),
})
const getTasksFromLsFxAttached = attach({
  effect: getTasksFromLsFx,
})
sample({
  clock: signinQuery.finished.success,
  target: getTasksFromLsFxAttached,
})

sample({
  clock: getTasksFromLsFxAttached.doneData,
  filter: (result) => !result.length,
  target: $$task.getTasksTriggered,
})
// use condition
sample({
  clock: getTasksFromLsFxAttached.doneData,
  source: $$session.$user,
  filter: (user, data) => Boolean(user) && data.length > 0,
  fn: (user, data) => ({ body: { user_id: user!.id, tasks: data } }),
  target: createManyTasksQuery.start,
})

sample({
  clock: signinQuery.finished.failure,
  fn: () => NOT_VALID_MESSAGE,
  target: $passwordError,
})

function checkError(value: string) {
  if (value.length > MAX_LENGTH) {
    return TOO_LONG_MESSAGE
  } else {
    return NOT_VALID_MESSAGE
  }
}
