import { createEvent, sample,createStore } from "effector";
import { UserDto } from "@/shared/api/user";

export const setSessionUserTriggered = createEvent<UserDto>()
export const setAuthorized = createEvent<boolean>()
export const resetSession = createEvent()

export const $sessionUser = createStore<UserDto | null>(null)

export const $isAuthorized = createStore(false)

sample({
    clock: resetSession,
    target: [$sessionUser.reinit!, $isAuthorized.reinit!]
})

sample({
    clock: setSessionUserTriggered,
    target: $sessionUser
})
sample({
    clock: setAuthorized,
    target: $isAuthorized
})
