import { sample, createEvent } from "effector"

import { $$session } from "@/entities/session"

import { authApi } from "@/shared/api/auth"
import { tokenService } from "@/shared/api/token"

export const submitTriggered = createEvent()

sample({
  clock: submitTriggered,
  target: authApi.logoutQuery.start,
})

sample({
  clock: authApi.logoutQuery.finished.success,
  target: [$$session.reset, tokenService.resetToken],
})
