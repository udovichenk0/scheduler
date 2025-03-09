import { createEvent, sample } from "effector"

import { $$session } from "@/entities/session"
import { getTaskModelInstance } from "@/entities/task"

import { authApi } from "@/shared/api/auth"
export const submitTriggered = createEvent()

const $$taskModel = getTaskModelInstance()

sample({
  clock: submitTriggered,
  target: authApi.signOut.start,
})

sample({
  clock: authApi.signOut.finished.success,
  target: [$$session.reset, $$taskModel.reset],
})
