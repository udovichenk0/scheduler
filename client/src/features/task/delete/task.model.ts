import { createEffect, createEvent, sample } from "effector"
import { not } from "patronum"

import { $isAuthenticated } from "@/entities/session"
import { $taskKv, Task } from "@/entities/task/tasks"

import { deleteTaskQuery } from "@/shared/api/task"

export const createRemoveTaskFactory = () => {
  const taskDeleted = createEvent<{ id: string }>()
  const deleteTaskFromLsFx = createEffect(({ id }: { id: string }) => {
    const tasksFromLs = localStorage.getItem("tasks")
    const tasks = JSON.parse(tasksFromLs!) as Task[]
    const filteredTasks = tasks.filter((task) => task.id !== id)
    localStorage.setItem("tasks", JSON.stringify(filteredTasks))
    return filteredTasks
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
    clock: deleteTaskFromLsFx.doneData,
    fn: (result) =>
      result.reduce((kv, task) => ({ ...kv, [task.id]: task }), {}),
    target: $taskKv,
  })
  sample({
    clock: deleteTaskQuery.finished.success,
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
    }
  }
}
