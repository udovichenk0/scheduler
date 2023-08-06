import { extend } from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import { createEffect, sample } from "effector"
import { createRoot } from "react-dom/client"

import App from "./app/App"
import "./app/index.css"
import { $taskKv, getTasksTriggered } from "./entities/task/tasks"
import { refreshQuery } from "./shared/api/token"
import { appStarted } from "./shared/config/init"
import { TaskDto } from "./shared/api/task"

extend(isSameOrAfter)
extend(isSameOrBefore)

sample({
  clock: appStarted,
  target: refreshQuery.start,
})

sample({
  clock: refreshQuery.finished.success,
  target: getTasksTriggered,
})
const takeTasksFromlsFx = createEffect(() => {
  const tasks = localStorage.getItem('tasks')
  if(tasks){
    return JSON.parse(tasks) as TaskDto[]
  }
  return []
})
sample({
  clock: refreshQuery.finished.failure,
  target: takeTasksFromlsFx
})

sample({
  clock: takeTasksFromlsFx.doneData,
  fn: (tasks) =>
    tasks.reduce((kv, task) => ({ ...kv, [task.id]: task }), {}),
  target: $taskKv,
})

appStarted()
createRoot(document.getElementById("root") as HTMLElement).render(<App />)
