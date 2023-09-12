import { extend } from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import isTomorrow from "dayjs/plugin/isTomorrow"
import isToday from "dayjs/plugin/isToday"
import { sample } from "effector"
import { createRoot } from "react-dom/client"

import App from "./app/App"
import "./app/index.css"
import { refreshQuery } from "./shared/api/token"
import { appInitializer } from "./app/initializer"
import { getTasksFromLsFx, tasksQuery } from "./shared/api/task"
extend(isSameOrAfter)
extend(isSameOrBefore)
extend(isTomorrow)
extend(isToday)

const { init } = appInitializer()

sample({
  clock: init,
  target: refreshQuery.start,
})

sample({
  clock: refreshQuery.finished.failure,
  target: getTasksFromLsFx,
})
sample({
  clock: refreshQuery.finished.success,
  target: tasksQuery.start,
})
init()
createRoot(document.getElementById("root") as HTMLElement).render(<App />)
