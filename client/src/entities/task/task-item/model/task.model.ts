import { createEffect, createEvent, createStore, sample, scopeBind } from "effector"
import { not } from "patronum"

import { $$session } from "@/entities/session"

import { TaskId, taskApi } from "@/shared/api/task"
import { singleton } from "@/shared/lib/effector/singleton"
import { createIdModal, createModal } from "@/shared/lib/modal"

import { Task } from "../type"
import { deleteById, tasksNotNull } from "../lib"

export const $$dateModal = createModal({})
export const $$modal = createIdModal()

export const $$task = singleton(() => {
  const $tasks = createStore<Nullable<Task[]>>(null)
  const setTaskTriggered = createEvent<Task>()
  const setTasksTriggered = createEvent<Task[]>()
  const getTasksTriggered = createEvent()
  const taskDeleted = createEvent<TaskId>()
  const trashTasksDeleted = createEvent()
  const reset = createEvent()
  const init = createEvent()

  const listenFx = createEffect(() => {
    const setTaskTriggeredScoped = scopeBind(setTasksTriggered)
    addEventListener('storage', (event) => {
      if(event.newValue && event.key == 'tasks'){
        setTaskTriggeredScoped(JSON.parse(event.newValue))
      }
    })
  })
  //tasks
  sample({
    clock: taskApi.getTasksQuery.finished.success,
    fn: ({ result }) => result,
    target: $tasks,
  })
  sample({
    clock: setTaskTriggered,
    source: $tasks,
    filter: tasksNotNull,
    fn: (oldTasks, newTask) => [...oldTasks, newTask],
    target: $tasks,
  })
  sample({
    clock: setTasksTriggered,
    target: $tasks
  })
  sample({
    clock: taskDeleted,
    source: $tasks,
    filter: tasksNotNull,
    fn: deleteById,
    target: $tasks,
  })
  sample({
    clock: trashTasksDeleted,
    source: $tasks,
    filter: tasksNotNull,
    fn: (tasks) => tasks.filter(task => !task.is_deleted),
    target: $tasks
  })

  sample({ //!move to create task model 
    clock: taskApi.createTasksQuery.finished.success,
    fn: ({result}) => result,
    target: [$tasks, taskApi.deleteTasksFromLocalStorageFx],
  })

  sample({
    clock: taskApi.getTasksFromLocalStorageFx.doneData,
    filter: not($$session.$isAuthenticated),
    target: $tasks,
  })

  sample({
    clock: getTasksTriggered,
    target: taskApi.getTasksQuery.start,
  })

  sample({
    clock: reset,
    target: $tasks.reinit,
  })

  sample({
    clock: init,
    target: listenFx
  })
  return {
    $tasks,
    setTaskTriggered,
    reset,
    getTasksTriggered,
    trashTasksDeleted,
    taskDeleted,
    init,
  }
})
