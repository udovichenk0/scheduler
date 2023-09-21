import { attach, createEvent, createStore, sample } from "effector"
import { spread } from "patronum"
import { z } from "zod"
import { t } from "i18next"

import { $$session } from "@/entities/session"
import { $$task } from "@/entities/task/task-item"

import { authApi } from "@/shared/api/auth"
import { tokenService } from "@/shared/api/token"
import { taskApi } from "@/shared/api/task"
import { bridge } from "@/shared/lib/effector/bridge"

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
export const resetSigninPasswordTriggered = createEvent()

export const $password = createStore("").on(
  passwordChanged,
  (_, password) => password,
)
export const $passwordError = createStore<Nullable<string>>(null)

const signinSchema = z.string().trim().min(MIN_LENGTH).max(MAX_LENGTH)

const getTasksFromLsFxAttached = attach({
  effect: taskApi.getTasksFromLocalStorageFx,
})

bridge(() => {
  sample({
    clock: submitTriggered,
    source: { email: $email, password: $password },
    filter: ({ password }) => signinSchema.safeParse(password).success,
    target: authApi.signinQuery.start,
  })
  sample({
    clock: submitTriggered,
    source: $password,
    filter: (password) => !signinSchema.safeParse(password).success,
    fn: checkError,
    target: $passwordError,
  })
  sample({
    clock: submitTriggered,
    source: $password,
    filter: (password) => !signinSchema.safeParse(password).success,
    fn: checkError,
    target: $passwordError,
  })
})

bridge(() => {
  sample({
    clock: authApi.signinQuery.finished.success,
    fn: ({ result }) => ({
      user: result.user,
      token: result.access_token,
    }),
    target: spread({
      targets: {
        user: $$session.sessionSet,
        token: tokenService.setTokenTriggered,
      },
    }),
  })
  sample({
    clock: authApi.signinQuery.finished.failure,
    fn: () => t(NOT_VALID_MESSAGE),
    target: $passwordError,
  })

  sample({
    clock: authApi.signinQuery.finished.success,
    target: getTasksFromLsFxAttached,
  })
})

bridge(() => {
  sample({
    clock: getTasksFromLsFxAttached.doneData,
    filter: (result) => !result.length,
    target: $$task.getTasksTriggered,
  })
  sample({
    clock: getTasksFromLsFxAttached.doneData,
    source: $$session.$user,
    filter: (user, data) => Boolean(user) && data.length > 0,
    fn: (user, data) => ({ body: { user_id: user!.id, tasks: data } }),
    target: taskApi.createTasks.start,
  })
})

sample({
  clock: resetSigninPasswordTriggered,
  target: [$passwordError.reinit, $password.reinit],
})

function checkError(value: string) {
  if (value.length > MAX_LENGTH) {
    return TOO_LONG_MESSAGE
  }
  if (value.length < MIN_LENGTH) {
    return TOO_SHORT_MESSAGE
  }
  return NOT_VALID_MESSAGE
}
