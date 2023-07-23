import { createEvent, sample,createStore } from "effector";
import { refreshQuery } from "@/shared/api/token";
import { User } from "./type";

export const setSessionUserTriggered = createEvent<User>()
export const resetSession = createEvent()

export const $sessionUser = createStore<User | null>(null)

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