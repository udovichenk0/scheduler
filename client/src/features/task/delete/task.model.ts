import { createEffect, createEvent, sample, merge } from "effector"
import { not } from "patronum"

import { $$session } from "@/entities/session"
import { $$task, Task } from "@/entities/task/tasks"

import { deleteTaskQuery } from "@/shared/api/task"

export const createRemoveTaskFactory = () => {
  const taskDeleted = createEvent<{ id: string }>()
  const deleteTaskFromLsFx = createEffect(({ id }: { id: string }) => {
    const tasksFromLs = localStorage.getItem("tasks")
    const parsedTasks = JSON.parse(tasksFromLs!) as Task[]

    const filteredTasks = parsedTasks.filter((task) => task.id !== id)

    localStorage.setItem("tasks", JSON.stringify(filteredTasks))
    const deletedTask = parsedTasks.find((task) => task.id === id)
    return {
      result: deletedTask!,
    }
  })
  sample({
    clock: taskDeleted,
    filter: $$session.$isAuthenticated,
    fn: ({ id }) => ({ body: { id } }),
    target: deleteTaskQuery.start,
  })
  sample({
    clock: taskDeleted,
    filter: not($$session.$isAuthenticated),
    target: deleteTaskFromLsFx,
  })
  sample({
    clock: [deleteTaskQuery.finished.success, deleteTaskFromLsFx.doneData],
    source: $$task.$taskKv,
    fn: (kv, { result }) => {
      const array = Object.entries(kv).filter(([key]) => key !== result.id)
      return Object.fromEntries(array)
    },
    target: $$task.$taskKv,
  })
  const taskSuccessfullyDeleted = merge([
    deleteTaskFromLsFx.done,
    deleteTaskQuery.finished.success,
  ])
  return {
    taskDeleted,
    taskSuccessfullyDeleted,
    _: {
      deleteTaskFromLsFx,
      deleteTaskQuery,
    },
  }
}
