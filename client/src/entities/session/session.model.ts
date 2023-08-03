import { createEvent, createStore, sample } from "effector"
import { refreshQuery } from "@/shared/api/token"
import { User } from "./type"

export const setSessionUserTriggered = createEvent<User>()
export const resetSession = createEvent()
const $user = createStore<User | null>(null)
sample({
  clock: refreshQuery.finished.success,
  fn: ({ result }) => result?.user,
  target: $user
})
export const $sessionUser = $user.map((user) => user)
sample({
  clock: setSessionUserTriggered,
  target: $user
})
sample({
  clock: resetSession,
  target: $user.reinit!
})