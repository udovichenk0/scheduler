import { createEvent, createStore, sample } from "effector"
import * as z from "@zod/mini"

import { $$session } from "@/entities/session/session.model.ts"

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

export const TaskPriority = {
  NONE: "none",
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
  URGENT: "urgent",
} as const

export const TaskStatus = {
  //!FIX rename
  INPROGRESS: "inprogress",
  FINISHED: "finished",
} as const

export const createTaskModel = () => {
  const $tasks = createStore<Nullable<Task[]>>(null)

  const addTask = createEvent<Task>()
  const setTasks = createEvent<Task[]>()
  const removeTask = createEvent<TaskId>()
  const replaceTask = createEvent<Task>()
  const replaceFields = createEvent<Partial<Task> & { id: TaskId }>()
  const updateFields = createEvent<{ id: TaskId; fields: EditableTaskFields }>()
  const reset = createEvent()

  const toggleCompletedShown = createEvent()
  const $isCompletedShown = createStore(0).on(toggleCompletedShown, (isShown) =>
    Number(!isShown),
  )

  sample({
    clock: addTask,
    source: $tasks,
    filter: Boolean,
    fn: (oldTasks, newTask) => [...oldTasks, newTask],
    target: $tasks,
  })

  sample({
    clock: removeTask,
    source: $tasks,
    filter: Boolean,
    fn: deleteById,
    target: $tasks,
  })

  sample({
    clock: replaceTask,
    source: $tasks,
    filter: Boolean,
    fn: (tasks, task) => {
      return tasks.map((t) => (t.id == task.id ? task : t))
    },
    target: $tasks,
  })
  sample({
    clock: replaceFields,
    source: $tasks,
    filter: Boolean,
    fn: (tasks, { id, ...fields }) => {
      return tasks.map((task) =>
        task.id === id ? { ...task, ...fields } : task,
      )
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
    clock: setTasks,
    target: $tasks,
  })

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
    addTask,
    setTasks,
    removeTask,
    replaceTask,
    updateFields,
    replaceFields,
    init,
    reset,
  }
}

const $$taskModel = createTaskModel()

sample({
  clock: $$session.$isAuthenticated,
  filter: Boolean,
  target: taskApi.tasksQuery.start,
})

sample({
  clock: taskApi.tasksQuery.finished.success,
  fn: ({ result }) => tasksToDomain(result),
  target: $$taskModel.$tasks,
})

export function getTaskModelInstance() {
  return $$taskModel
}

export type TaskModel = typeof $$taskModel
