import { createEvent, createStore, sample } from "effector"
import { z } from "zod"
import { t } from "i18next"

import { authApi } from "@/shared/api/auth"
import { UNEXPECTED_ERROR_MESSAGE } from "@/shared/lib/error"

import {
  MAX_LENGTH,
  MIN_LENGTH,
  NOT_VALID_MESSAGE,
  TOO_LONG_MESSAGE,
  TOO_SHORT_MESSAGE,
} from "./constants"

export const emailChanged = createEvent<string>()
export const submitTriggered = createEvent()
export const resetEmailTriggered = createEvent()

export const $email = createStore<string>("")
export const $error = createStore<Nullable<string>>(null)
const emailSchema = z.string().email().min(MIN_LENGTH).max(MAX_LENGTH)

sample({
  clock: emailChanged,
  target: $email,
})

sample({
  clock: submitTriggered,
  source: $email,
  filter: (email) => emailSchema.safeParse(email).success,
  target: authApi.checkVerifiedEmailExists.start,
})

sample({
  clock: submitTriggered,
  source: $email,
  filter: (email) => !emailSchema.safeParse(email).success,
  fn: getErrorMessage,
  target: $error,
})
sample({
  clock: authApi.checkVerifiedEmailExists.finished.failure,
  fn: () => t(UNEXPECTED_ERROR_MESSAGE),
  target: $error
})

sample({
  clock: resetEmailTriggered,
  target: [$error.reinit!, $email.reinit!],
})

function getErrorMessage(value: Nullable<string>) {
  if (!value || value.length < MIN_LENGTH) {
    return t(TOO_SHORT_MESSAGE)
  }
  if (value.length > MAX_LENGTH) {
    return t(TOO_LONG_MESSAGE)
  } else {
    return t(NOT_VALID_MESSAGE)
  }
}
