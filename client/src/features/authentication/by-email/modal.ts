import { createEvent, createStore, sample } from "effector";

export const emailChanged = createEvent<string>()
export const submitTriggered = createEvent()

export const $email = createStore('')
export const $emailError = createStore('')

sample({
    clock: emailChanged,
    target: $email
})

