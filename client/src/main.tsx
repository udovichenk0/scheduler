import { extend } from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import isTomorrow from "dayjs/plugin/isTomorrow"
import isToday from "dayjs/plugin/isToday"
import { sample } from "effector"
import { createRoot } from "react-dom/client"

import App from "./app/App"
import "./app/index.css"
import { tokenApi } from "./shared/api/token"
import { appInitializer } from "./app/initializer"
import { taskApi } from "./shared/api/task"
extend(isSameOrAfter)
extend(isSameOrBefore)
extend(isTomorrow)
extend(isToday)

const { init } = appInitializer()

sample({
  clock: init,
  target: tokenApi.refreshQuery.start,
})

sample({
  clock: tokenApi.refreshQuery.finished.failure,
  target: taskApi.getTasksFromLocalStorageFx,
})
sample({
  clock: tokenApi.refreshQuery.finished.success,
  target: taskApi.getTasks.start,
})
init()
createRoot(document.getElementById("root") as HTMLElement).render(<App />)
