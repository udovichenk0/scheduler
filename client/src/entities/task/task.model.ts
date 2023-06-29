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

sample({
  clock: getTasksTriggered,
  target: getTaskQuery.start
})
