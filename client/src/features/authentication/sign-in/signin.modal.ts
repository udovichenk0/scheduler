import { createEffect, createEvent, createStore, sample } from "effector"
import { z } from "zod"
import { signinFx } from "@/shared/api/auth/signin"
import { $email } from "../by-email"

export const passwordChanged = createEvent<string>()
export const submitTriggered = createEvent()
export const resetTriggered = createEvent()

export const $password = createStore('')
export const $passwordError = createStore<'too_small' | 'invalid_string' |  null>(null)

const loginSchema = z.string().min(8).trim()

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
    filter: ({password}) => loginSchema.safeParse(password).success,
    target: signinFx
})