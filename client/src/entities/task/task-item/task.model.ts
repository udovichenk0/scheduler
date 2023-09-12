import { createEvent, createStore, sample } from "effector"
import { not } from "patronum"

import { $$session } from "@/entities/session"

import { taskApi } from "@/shared/api/task"
import { singleton } from "@/shared/lib/singleton"
import { createModal } from "@/shared/lib/modal"

import { Task } from "./type"

export const $$dateModal = createModal({})
export const $$task = singleton(() => {
  const $taskKv = createStore<Record<string, Task>>({})
  const setTaskKvTriggered = createEvent<Task[]>()
  const setTaskTriggered = createEvent<Task>()
  const getTasksTriggered = createEvent()
  const taskDeleted = createEvent<Task>()
  const reset = createEvent()
  sample({
    clock: taskApi.getTasks.finished.success,
    fn: ({ result }) =>
      result.reduce((kv, task) => ({ ...kv, [task.id]: task }), {}),
    target: $taskKv,
  })
  sample({
    clock: setTaskKvTriggered,
    fn: (tasks) => tasks.reduce((kv, task) => ({ ...kv, [task.id]: task }), {}),
    target: $taskKv,
  })
  sample({
    clock: setTaskTriggered,
    source: $taskKv,
    fn: (kv, task) => ({ ...kv, [task.id]: task }),
    target: $taskKv,
  })
  sample({
    clock: taskApi.createTasks.finished.success,
    target: [getTasksTriggered, taskApi.deleteTasksFromLocalStorageFx],
  })

  sample({
    clock: taskApi.getTasksFromLocalStorageFx.doneData,
    filter: not($$session.$isAuthenticated),
    target: setTaskKvTriggered,
  })
  sample({
    clock: taskDeleted,
    source: $taskKv,
    fn: (kv, task) => {
      const array = Object.entries(kv).filter(([key]) => key !== task.id)
      return Object.fromEntries(array)
    },
    target: $taskKv,
  })
  sample({
    clock: getTasksTriggered,
    target: taskApi.getTasks.start,
  })

  sample({
    clock: reset,
    target: $taskKv.reinit!,
  })

  return {
    $taskKv: $taskKv.map((kv) => kv),
    setTaskKvTriggered,
    setTaskTriggered,
    reset,
    getTasksTriggered,
    taskDeleted,
    _: {
      $taskKv,
    },
  }
})
export type TaskKv = typeof $$task.$taskKv
