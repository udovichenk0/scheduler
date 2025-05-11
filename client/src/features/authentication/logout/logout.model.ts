import { createEvent, sample } from "effector"

import { $$session } from "@/entities/session/session.model.ts"
import { getTaskModelInstance } from "@/entities/task/model/task.model.ts"

import { authApi } from "@/shared/api/auth/auth.api.ts"
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
