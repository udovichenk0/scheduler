import { createEvent, createStore, sample } from "effector"
import { z } from "zod"
import { getUserQuery } from "@/shared/api/user"
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

export const $email = createStore("")
export const $emailError = createStore<string | null>(null)
const emailSchema = z.string().email().min(MIN_LENGTH).max(MAX_LENGTH)

sample({
  clock: emailChanged,
  target: $email,
})

// fetch after success email validation
sample({
  clock: submitTriggered,
  source: $email,
  filter: (email) => emailSchema.safeParse(email).success,
  fn: (email) => ({ email }),
  target: getUserQuery.start,
})

// store an error after failure validation
sample({
  clock: submitTriggered,
  source: $email,
  filter: (email) => !emailSchema.safeParse(email).success,
  fn: checkError,
  target: $emailError,
})

// restore emailError
sample({
  clock: resetEmailTriggered,
  target: [$emailError.reinit!, $email.reinit!],
})

function checkError(value: string) {
  if (value.length < MIN_LENGTH) {
    return TOO_SHORT_MESSAGE
  }
  if (value.length > MAX_LENGTH) {
    return TOO_LONG_MESSAGE
  } else {
    return NOT_VALID_MESSAGE
  }
}
