import { combine, createEvent, createStore, sample } from "effector"
import { getTaskQuery } from "@/shared/api/task"
import { TaskDto } from "@/shared/api/task/task.dto"


export const $taskKv = createStore<Record<number, TaskDto>>({})

export const getTasksTriggered = createEvent()

sample({
  clock: getTaskQuery.finished.success,
  fn: ({result:{result}}) => result.reduce((kv, task) => ({...kv, [task.id]: task}),{}),
  target: $taskKv
})

export const $inboxTasks = combine($taskKv, (kv) => {
  return Object.values(kv)
    .filter(task => task.type == 'inbox')
})
export const $todayTasks = combine($taskKv, (kv) => {
  console.log(Object.values(kv).map((task) => console.log(task.start_date))
  )
  return Object.values(kv)
    .filter(task => task.start_date && new Date().getDate() == new Date(task.start_date).getDate())
})
sample({
  clock: getTasksTriggered,
  target: getTaskQuery.start
})
