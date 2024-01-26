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
import { UNEXPECTED_ERROR_MESSAGE, invalid_password, isHttpErrorType } from "@/shared/lib/error"

import { $email, resetEmailTriggered } from "../check-email"

import {
  MAX_LENGTH,
  MIN_LENGTH,
  INVALID_PASSWORD_MESSAGE,
  TOO_LONG_PASSWORD_MESSAGE,
  TOO_SHORT_PASSWORD_MESSAGE,
} from "./constants"

export const passwordChanged = createEvent<string>()
export const submitTriggered = createEvent()
export const resetSigninPasswordTriggered = createEvent()

export const $password = createStore<string>("").on(
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
    filter: ({ password }) => {
      return signinSchema.safeParse(password).success
    },
    target: authApi.signinQuery.start,
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
      user: $$session.sessionSet,
      token: tokenService.setTokenTriggered,
    }),
  })
  sample({
    clock: authApi.signinQuery.finished.failure,
    fn: () => t(INVALID_PASSWORD_MESSAGE),
    target: $passwordError,
  })
  sample({
    clock: authApi.signinQuery.finished.failure,
    fn: ({ error }) => {
      return isHttpErrorType(error, invalid_password)
        ? t(INVALID_PASSWORD_MESSAGE)
        : t(UNEXPECTED_ERROR_MESSAGE)
    }
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
    fn: (_, data) => ({ tasks: data }),
    target: taskApi.createTasksQuery.start,
  })
})

sample({
  clock: resetSigninPasswordTriggered,
  target: [$passwordError.reinit, $password.reinit, resetEmailTriggered],
})

function checkError(value: Nullable<string>) {
  if(!value || value.length < MIN_LENGTH){
    return TOO_SHORT_PASSWORD_MESSAGE
  }
  if (value.length > MAX_LENGTH) {
    return TOO_LONG_PASSWORD_MESSAGE
  }
  return INVALID_PASSWORD_MESSAGE
}
