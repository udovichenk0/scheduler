import { createEffect, createEvent, createStore, sample, scopeBind } from "effector"
import { not } from "patronum"

import { $$session } from "@/entities/session"

import { TaskId, taskApi } from "@/shared/api/task"
import { singleton } from "@/shared/lib/effector/singleton"
import { createIdModal, createModal } from "@/shared/lib/modal"

import { Task, TaskKv } from "../type"
import { addTaskToKv, removeTaskFromKv, transformTasksToKv } from "../lib"

export const $$dateModal = createModal({})
export const $$modal = createIdModal()

export const $$task = singleton(() => {
  const $taskKv = createStore<Nullable<TaskKv>>(null)
  const setTaskKvTriggered = createEvent<Task[]>()
  const setTaskTriggered = createEvent<Task>()
  const getTasksTriggered = createEvent()
  const taskDeleted = createEvent<TaskId>()
  const reset = createEvent()
  const init = createEvent()

  const listenFx = createEffect(() => {
    const setTaskKvTriggeredScoped = scopeBind(setTaskKvTriggered)
    addEventListener('storage', (event) => {
      if(event.newValue && event.key == 'tasks'){
        setTaskKvTriggeredScoped(JSON.parse(event.newValue))
      }
    })
  })

  sample({
    clock: taskApi.getTasksQuery.finished.success,
    fn: ({ result }) => transformTasksToKv(result),
    target: $taskKv,
  })
  sample({
    clock: setTaskTriggered,
    source: $taskKv,
    filter: (kv: Nullable<TaskKv>): kv is TaskKv => !!kv,
    fn: addTaskToKv,
    target: $taskKv,
  })
  sample({
    clock: taskDeleted,
    source: $taskKv,
    filter: (kv: Nullable<TaskKv>): kv is TaskKv => !!kv,
    fn: removeTaskFromKv,
    target: $taskKv,
  })
  sample({
    clock: setTaskKvTriggered,
    fn: transformTasksToKv,
    target: $taskKv,
  })
  sample({
    clock: taskApi.createTasksQuery.finished.success,
    fn: ({result}) => result,
    target: [setTaskKvTriggered, taskApi.deleteTasksFromLocalStorageFx],
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

  sample({
    clock: init,
    target: listenFx
  })
  return {
    $taskKv: $taskKv.map((kv) => kv),
    setTaskTriggered,
    reset,
    getTasksTriggered,
    taskDeleted,
    init,
    _: {
      $taskKv,
    },
  }
})
