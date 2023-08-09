import { createEvent, sample } from "effector"
import { createBrowserHistory } from "history"

import { router } from "./router"
export const history = createBrowserHistory()
export const createHistory = () => {
  const init = createEvent()
  const history = createBrowserHistory()

  sample({
    clock: init,
    fn: () => history,
    target: router.setHistory,
  })
  return {
    init,
  }
}
