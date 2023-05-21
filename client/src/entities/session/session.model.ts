import { createEvent, sample,createStore } from "effector";
import { debug } from "patronum";
import { UserDto } from "@/shared/api/user";

export const setSessionUserTriggered = createEvent<UserDto>()
export const setAuthorized = createEvent<boolean>()

export const $sessionUser = createStore<UserDto | null>(null)
export const $isAuthorized = createStore(false)
debug($isAuthorized)
sample({
    clock: setSessionUserTriggered,
    target: $sessionUser
})
sample({
    clock: setAuthorized,
    target: $isAuthorized
})
