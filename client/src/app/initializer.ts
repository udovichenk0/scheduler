import { createEvent, sample } from "effector"

import { $$pomodoroSettings } from "@/entities/settings/pomodoro"
import { $$themeSettings } from "@/entities/settings/theme/main-theme"
import { $$accentSettings } from "@/entities/settings/theme/icon-theme"

import { createHistory } from "@/shared/routing"
import { $$i18n } from "@/shared/i18n"

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
      pomodoro.init,
    ],
  })
  return {
    init,
  }
}
