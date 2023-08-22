import { extend } from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import { createEffect, sample } from "effector"
import { createRoot } from "react-dom/client"
import { not } from "patronum"

import App from "./app/App"
import "./app/index.css"
import { $$task, Task } from "./entities/task/tasks"
import { refreshQuery } from "./shared/api/token"
import { appInitializer } from "./app/initializer"
import { $$session, User } from "./entities/session"
import { createManyTasksQuery } from "./shared/api/task"

extend(isSameOrAfter)
extend(isSameOrBefore)

const { init } = appInitializer()

sample({
  clock: init,
  target: refreshQuery.start,
})

type TaskPayload = Omit<Task, "user_id">

const takeTasksFromlsFx = createEffect(() => {
  const tasks = localStorage.getItem("tasks")
  if (tasks) {
    return JSON.parse(tasks) as TaskPayload[]
  }
  return []
})
const deleteTasksFromlsFx = createEffect(() => {
  localStorage.removeItem("tasks")
})
sample({
  clock: [refreshQuery.finished.finally],
  target: takeTasksFromlsFx,
})

sample({
  clock: takeTasksFromlsFx.doneData,
  source: $$session.$user,
  filter: (user: Nullable<User>, data: TaskPayload[]): user is User =>
    Boolean(user) && data.length === 0,
  target: $$task.getTasksTriggered,
})

sample({
  clock: takeTasksFromlsFx.doneData,
  source: $$session.$user,
  filter: (user: Nullable<User>, data: TaskPayload[]): user is User =>
    Boolean(user) && data.length > 0,
  fn: (user, data) => ({ body: { user_id: user.id, tasks: data } }),
  target: createManyTasksQuery.start,
})
sample({
  clock: createManyTasksQuery.finished.success,
  target: [$$task.getTasksTriggered, deleteTasksFromlsFx],
})

sample({
  clock: takeTasksFromlsFx.doneData,
  filter: not($$session.$isAuthenticated),
  fn: (tasks) => tasks.reduce((kv, task) => ({ ...kv, [task.id]: task }), {}),
  target: $$task.$taskKv,
})
init()
createRoot(document.getElementById("root") as HTMLElement).render(<App />)
