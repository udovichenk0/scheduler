import { createEvent, sample,createStore } from "effector";
import { refreshQuery } from "@/shared/api/token";
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

sample({
    clock: refreshQuery.finished.success,
    fn: ({result}) => result.user,
    target: setSessionUserTriggered
  })