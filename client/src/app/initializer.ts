import { $$taskModel } from '@/entities/task';
import { $$session } from '@/entities/session';
import { createEvent, sample } from "effector"

import { $$pomodoroSettings } from "@/entities/settings/pomodoro"
import { $$themeSettings } from "@/entities/settings/theme/main-theme"

import { createHistory } from "@/shared/routing"
import { $$i18n } from "@/shared/i18n"
import { $$accentSettings } from '@/entities/settings/theme/icon-theme';

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
    ]
  })
  return {
    init,
  }
}
