import { createEvent, sample, createStore } from "effector";

export const setTokenTriggered = createEvent<string>()
export const resetToken = createEvent()

export const $accessToken = createStore<string | null>(null)

sample({
    clock: setTokenTriggered,
    target: $accessToken
})

sample({
    clock: resetToken,
    target: $accessToken.reinit!
})
