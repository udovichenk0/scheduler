import { createEvent, sample } from "effector"

import { createHistory } from "@/shared/routing"
import { createTheme } from "@/shared/theme/create-theme"

export const appInitializer = () => {
  const init = createEvent()
  const $$themeInitializer = createTheme()
  const $$routerHistory = createHistory()

  sample({
    clock: init,
    target: [$$themeInitializer.init, $$routerHistory.init],
  })

  return {
    init,
  }
}
