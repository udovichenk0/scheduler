import { createEvent, createStore, sample } from "effector"
import { not } from "patronum"

import { $$session } from "@/entities/session"

import { taskApi } from "@/shared/api/task"
import { singleton } from "@/shared/lib/effector/singleton"
import { createModal } from "@/shared/lib/modal"

import { Task } from "./type"
import { addTaskToKv, removeTaskFromKv, transformTasksToKv } from "./lib"

export const $$dateModal = createModal({})
export const $$task = singleton(() => {
  const $taskKv = createStore<Record<string, Task>>({})
  const setTaskKvTriggered = createEvent<Task[]>()
  const setTaskTriggered = createEvent<Task>()
  const getTasksTriggered = createEvent()
  const taskDeleted = createEvent<Task>()
  const reset = createEvent()

  sample({
    clock: taskApi.getTasksQuery.finished.success,
    fn: ({ result }) => transformTasksToKv(result),
    target: $taskKv,
  })
  sample({
    clock: setTaskTriggered,
    source: $taskKv,
    fn: addTaskToKv,
    target: $taskKv,
  })
  sample({
    clock: taskDeleted,
    source: $taskKv,
    fn: (kv, task) => removeTaskFromKv(kv, task.id),
    target: $taskKv,
  })
  sample({
    clock: setTaskKvTriggered,
    fn: transformTasksToKv,
    target: $taskKv,
  })
  sample({
    clock: taskApi.createTasksQuery.finished.success,
    target: [getTasksTriggered, taskApi.deleteTasksFromLocalStorageFx],
  })
  sample({
    clock: taskApi.getTasksFromLocalStorageFx.doneData,
    filter: not($$session.$isAuthenticated),
    target: setTaskKvTriggered,
  })

  sample({
    clock: getTasksTriggered,
    target: taskApi.getTasksQuery.start,
  })

  sample({
    clock: reset,
    target: $taskKv.reinit!,
  })

  return {
    $taskKv: $taskKv.map((kv) => kv),
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
