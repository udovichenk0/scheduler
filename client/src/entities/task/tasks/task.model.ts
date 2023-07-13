import { createEvent, createStore, sample } from "effector"
import { tasksQuery, TaskDto } from "@/shared/api/task"

export const $taskKv = createStore<Record<number, TaskDto>>({})

export const getTasksTriggered = createEvent()

sample({
  clock: tasksQuery.finished.success,
  fn: ({result:{result}}) => result.reduce((kv, task) => ({...kv, [task.id]: task}),{}),
  target: $taskKv
})

sample({
  clock: getTasksTriggered,
  target: tasksQuery.start
})
