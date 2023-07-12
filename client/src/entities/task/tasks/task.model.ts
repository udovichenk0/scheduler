import dayjs from "dayjs"
import { combine, createEvent, createStore, sample } from "effector"
import { getTaskQuery, TaskDto } from "@/shared/api/task"


export const $taskKv = createStore<Record<number, TaskDto>>({})

export const getTasksTriggered = createEvent()

sample({
  clock: getTaskQuery.finished.success,
  fn: ({result:{result}}) => result.reduce((kv, task) => ({...kv, [task.id]: task}),{}),
  target: $taskKv
})

sample({
  clock: getTasksTriggered,
  target: getTaskQuery.start
})
