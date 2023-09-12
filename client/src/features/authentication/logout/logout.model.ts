import { sample } from "effector"
import { createEvent } from "effector/compat"

import { $$session } from "@/entities/session"
import { $$task } from "@/entities/task/task-item"

import { authApi } from "@/shared/api/auth"
import { tokenService } from "@/shared/api/token"

export const submitTriggered = createEvent()

sample({
  clock: submitTriggered,
  target: authApi.logoutQuery.start,
})

sample({
  clock: authApi.logoutQuery.finished.success,
  target: [$$session.reset, tokenService.resetToken, $$task.reset],
})
