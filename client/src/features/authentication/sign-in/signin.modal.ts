import { createEffect, createEvent, createStore, sample } from "effector"
import { z } from "zod"

export const loginChanged = createEvent<string>()
export const submitTriggered = createEvent()
export const resetTriggered = createEvent()

export const $login = createStore('')
export const $loginError = createStore<'too_small' | 'invalid_string' |  null>(null)

const emailSchema = z.string().email().min(4)

export const checkUserFx = createEffect<string, number>(async(login) => {
    return 1
})

sample({
    clock: loginChanged,
    target: $login
})