import { createEvent, createStore, sample } from "effector"
import { debug } from "patronum"
import { z } from "zod"
import { signupFx } from "@/shared/api/auth/signup"
import { $email } from "../by-email"

export const passwordChanged = createEvent<string>()
export const submitTriggered = createEvent()
export const resetTriggered = createEvent()

export const $password = createStore('')
export const $passwordError = createStore<'too_small' | 'invalid_string' |  null>(null)

const loginSchema = z.string().min(8)   


sample({
    clock: passwordChanged,
    target: $password
})
sample({
    clock: submitTriggered,
    source: {email: $email,password: $password},
    filter: ({password}) => loginSchema.safeParse(password).success,
    target: signupFx
})
