import { createEvent, createStore, sample } from "effector"

import { tasksQuery } from "@/shared/api/task"

import { Task } from "./type"

export const $taskKv = createStore<Record<number, Task>>({})
export const $taskIds = createStore<number[]>([])
export const getTasksTriggered = createEvent()

sample({
  clock: tasksQuery.finished.success,
  fn: ({ result }) =>
    result.reduce((kv, task) => ({ ...kv, [task.id]: task }), {}),
  target: $taskKv,
})

sample({
  clock: getTasksTriggered,
  target: tasksQuery.start,
})
