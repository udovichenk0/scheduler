import { createEvent, createStore, sample } from "effector"

import { tasksQuery } from "@/shared/api/task"
import { singleton } from "@/shared/lib/singleton"

import { Task } from "./type"
export const $$task = singleton(() => {
  // change type number to string
  const $taskKv = createStore<Record<number, Task>>({})
  const setTaskKvTriggered = createEvent<Task[]>()
  const setTaskTriggered = createEvent<Task>()
  const getTasksTriggered = createEvent()
  const clearTaskKvTriggered = createEvent()
  sample({
    clock: tasksQuery.finished.success,
    fn: ({ result }) =>
      result.reduce((kv, task) => ({ ...kv, [task.id]: task }), {}),
    target: $taskKv,
  })
  sample({
    clock: setTaskKvTriggered,
    fn: (tasks) => tasks.reduce((kv, task) => ({ ...kv, [task.id]: task }), {}),
  })
  sample({
    clock: setTaskTriggered,
    source: $taskKv,
    fn: (kv, task) => ({ ...kv, [task.id]: task }),
    target: $taskKv,
  })
  sample({
    clock: getTasksTriggered,
    target: tasksQuery.start,
  })

  sample({
    clock: clearTaskKvTriggered,
    target: $taskKv.reinit!,
  })
  return {
    $taskKv: $taskKv.map((kv) => kv),
    setTaskKvTriggered,
    setTaskTriggered,
    clearTaskKvTriggered,
    getTasksTriggered,
  }
})
export type TaskKv = typeof $$task.$taskKv
