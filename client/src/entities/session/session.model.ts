import { createEvent, sample,createStore } from "effector";
import { UserDto } from "@/shared/api/user";

export const setSessionUserTriggered = createEvent<UserDto>()
export const resetSession = createEvent()

export const $sessionUser = createStore<UserDto | null>(null)

sample({
    clock: resetSession,
    target: [$sessionUser.reinit!]
})

sample({
    clock: setSessionUserTriggered,
    target: $sessionUser
})