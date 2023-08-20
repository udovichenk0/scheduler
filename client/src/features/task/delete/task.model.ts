import { createEffect, createEvent, sample } from "effector"
import { not } from "patronum"

import { $isAuthenticated } from "@/entities/session"
import { $taskKv, Task } from "@/entities/task/tasks"

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
      result: deletedTask!
    }
  })
  sample({
    clock: taskDeleted,
    filter: $isAuthenticated,
    fn: ({ id }) => ({ body: { id } }),
    target: deleteTaskQuery.start,
  })
  sample({
    clock: taskDeleted,
    filter: not($isAuthenticated),
    target: deleteTaskFromLsFx,
  })
  sample({
    clock: [deleteTaskQuery.finished.success, deleteTaskFromLsFx.doneData],
    source: $taskKv,
    fn: (kv, { result }) => {
      const array = Object.entries(kv).filter(([key]) => key !== result.id)
      return Object.fromEntries(array)
    },
    target: $taskKv,
  })
  return {
    taskDeleted,
    _: {
      deleteTaskFromLsFx,
      deleteTaskQuery,
    },
  }
}
