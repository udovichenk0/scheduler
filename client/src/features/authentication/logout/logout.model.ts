import { sample } from "effector"
import { createEvent } from "effector/compat"

import { $$session } from "@/entities/session"
import { $$task } from "@/entities/task/task-item"

import { logoutQuery } from "@/shared/api/auth"
import { resetToken } from "@/shared/api/token"

export const submitTriggered = createEvent()

sample({
  clock: submitTriggered,
  target: logoutQuery.start,
})

sample({
  clock: logoutQuery.finished.success,
  target: [$$session.reset, resetToken, $$task.reset],
})
