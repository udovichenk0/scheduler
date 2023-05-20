import { createEvent, sample, createStore } from "effector";
import { debug } from "patronum";

export const setTokenTriggered = createEvent<string>()

export const $accessToken = createStore<string | null>(null)
debug($accessToken)
sample({
    clock: setTokenTriggered,
    target: $accessToken
})
