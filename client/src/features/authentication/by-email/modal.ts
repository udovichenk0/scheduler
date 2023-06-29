import { createEvent, createStore, sample } from "effector";
import { z } from 'zod'
import { getUserQuery } from "@/shared/api/user";
import { MAX_LENGTH, MIN_LENGTH, NOT_VALID_ERROR, TOO_LONG_ERROR, TOO_SHORT_ERROR } from "./constants";

type Errors = 'too_short' | 'too_long' | 'invalid_string'

export const emailChanged = createEvent<string>()
export const submitTriggered = createEvent()
export const resetEmailTriggered = createEvent()

export const $email = createStore('')
export const $emailError = createStore<Errors | null>(null)
const emailSchema = z.string().email().min(MIN_LENGTH).max(MAX_LENGTH)

sample({
  clock: emailChanged,
  target: $email
})


// fetch after success email validation
sample({
  clock: submitTriggered,
  source: $email,
  filter: (email) => emailSchema.safeParse(email).success,
  fn: (email) => ({email}),
  target: getUserQuery.start
})

// store an error after failure validation
sample({
  clock: submitTriggered,
  source: $email,
  filter: (email) => !emailSchema.safeParse(email).success,    
  fn: checkError,
  target: $emailError
})

// restore emailError
sample({
  clock: resetEmailTriggered,
  target: [$emailError.reinit!, $email.reinit!]
})

function checkError(value:string){
  if(value.length < MIN_LENGTH){
    return TOO_SHORT_ERROR
  }
  if(value.length > MAX_LENGTH){
    return TOO_LONG_ERROR
  }
  else {
    return NOT_VALID_ERROR
  }
}

