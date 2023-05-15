import { createEffect, createEvent, createStore, sample } from "effector"
import { z } from "zod"

export const passwordChanged = createEvent<string>()
export const submitTriggered = createEvent()
export const resetTriggered = createEvent()

export const $password = createStore('')
export const $passwordError = createStore<'too_small' | 'invalid_string' |  null>(null)

const loginSchema = z.string().min(8).trim()

export const checkUserFx = createEffect<string, number>(async(login) => {
    return 1
})

sample({
    clock: passwordChanged,
    target: $password
})