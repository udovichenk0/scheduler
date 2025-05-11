import { createEvent, sample } from "effector"

import { $$taskModel } from "@/entities/task/model/task.model.ts"
import { $$session } from "@/entities/session/session.model.ts"
import { $$pomodoroSettings } from "@/entities/settings/pomodoro/model.ts"
import { $$themeSettings } from "@/entities/settings/theme/main-theme/main-theme.model.ts"
import { $$accentSettings } from "@/entities/settings/theme/icon-theme/icon-theme.model.ts"

import { createHistory } from "@/shared/routing/history.ts"
import { $$i18n } from "@/shared/i18n/i18n.ts"

export const appInitializer = () => {
  const init = createEvent()
  const $$routerHistory = createHistory()
  const theme = $$themeSettings
  const pomodoro = $$pomodoroSettings
  sample({
    clock: init,
    target: [
      $$accentSettings.init,
      $$routerHistory.init,
      $$i18n.init,
      theme.init,
      $$session.init,
      pomodoro.init,
      $$taskModel.init,
    ],
  })
  return {
    init,
  }
}
