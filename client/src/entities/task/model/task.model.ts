import { createEvent, createStore, sample } from "effector"
import { and } from "patronum"
import * as z from "@zod/mini"

import { $$session } from "@/entities/session/session.model.ts"

import { singleton } from "@/shared/lib/effector/singleton.ts"
import { taskApi } from "@/shared/api/task/task.api.ts"
import { TaskId } from "@/shared/api/task/task.dto.ts"
import { cookiePersist } from "@/shared/lib/storage/cookie-persist.ts"

import { EditableTaskFields, Task } from "../type"
import { deleteById, tasksToDomain } from "../lib"

export const TaskType = {
  //!FIX rename
  INBOX: "inbox",
  UNPLACED: "unplaced",
} as const

export const TaskStatus = {
  //!FIX rename
  INPROGRESS: "inprogress",
  FINISHED: "finished",
} as const

export const $$taskModel = singleton(() => {
  const $tasks = createStore<Nullable<Task[]>>(null)

  const addTaskTriggered = createEvent<Task>()
  const setTasksTriggered = createEvent<Task[]>()
  const taskDeleted = createEvent<TaskId>()
  const taskReplaced = createEvent<Task>()
  const updateFields = createEvent<{ id: TaskId; fields: EditableTaskFields }>()
  const reset = createEvent()

  const toggleCompletedShown = createEvent()
  const $isCompletedShown = createStore(0).on(toggleCompletedShown, (isShown) =>
    Number(!isShown),
  )

  sample({
    clock: addTaskTriggered,
    source: $tasks,
    filter: Boolean,
    fn: (oldTasks, newTask) => [...oldTasks, newTask],
    target: $tasks,
  })

  sample({
    clock: taskDeleted,
    source: $tasks,
    filter: Boolean,
    fn: deleteById,
    target: $tasks,
  })

  sample({
    clock: taskReplaced,
    source: $tasks,
    filter: Boolean,
    fn: (tasks, task) => {
      return tasks.map((t) => (t.id == task.id ? task : t))
    },
    target: $tasks,
  })
  sample({
    clock: updateFields,
    source: $tasks,
    filter: Boolean,
    fn: (tasks, { id, fields }) => {
      return tasks.map((t) => (t.id == id ? { ...t, ...fields } : t))
    },
    target: $tasks,
  })

  sample({
    clock: [
      taskApi.tasksQuery.finished.success,
      // taskApi.getTasksFromLocalStorageFx.finished.success
    ], //!localstorage tasks FIX localstorage versioning
    fn: ({ result }) => tasksToDomain(result),
    target: $tasks,
  })

  sample({
    clock: setTasksTriggered,
    target: $tasks,
  })

  sample({
    clock: $$session.$isAuthenticated,
    filter: and($$session.$isAuthenticated, $$session.$user),
    target: taskApi.tasksQuery.start,
  })

  // sample({
  //   clock: $$session.inited,
  //   filter: not($$session.$isAuthenticated),
  //   target: taskApi.getTasksFromLocalStorageFx.start
  // })

  sample({
    clock: reset,
    target: [$tasks.reinit],
  })

  const init = cookiePersist({
    source: $isCompletedShown,
    name: "isCompletedShown",
    schema: z.coerce.number(),
  })
  return {
    $tasks,
    $isCompletedShown: $isCompletedShown.map(Boolean),
    toggleCompletedShown,
    addTaskTriggered,
    setTasksTriggered,
    taskDeleted,
    taskReplaced,
    updateFields,
    init,
    reset,
  }
})

export function getTaskModelInstance() {
  return $$taskModel
}

export type TaskModel = typeof $$taskModel
