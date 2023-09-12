import { createEvent, createStore, sample } from "effector"
import { spread } from "patronum"

import { $$session } from "@/entities/session"

import { authApi } from "@/shared/api/auth"
import { tokenService } from "@/shared/api/token"

import { $email } from "../by-email"
export const CODE_LENGTH = 6
export const $code = createStore("")
export const codeChanged = createEvent<string>()
export const submitTriggered = createEvent()
sample({
  clock: codeChanged,
  filter: (code) => code.length === CODE_LENGTH,
  target: submitTriggered,
})
sample({
  clock: codeChanged,
  target: $code,
})
sample({
  clock: codeChanged,
  target: $code,
})
sample({
  clock: submitTriggered,
  source: { code: $code, email: $email },
  fn: ({ code, email }) => ({ code, email }),
  target: authApi.verifyQuery.start,
})
sample({
  clock: authApi.verifyQuery.finished.success,
  fn: ({ result }) => ({
    user: result.user,
    token: result.access_token,
  }),
  target: spread({
    targets: {
      user: $$session.sessionSet,
      token: tokenService.setTokenTriggered,
    },
  }),
})
