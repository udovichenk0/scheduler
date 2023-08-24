import { createEffect, createEvent, sample, merge } from "effector"
import { not } from "patronum"
import { attachOperation } from "@farfetched/core"

import { $$session } from "@/entities/session"
import { $$task, LocalStorageTask } from "@/entities/task/tasks"

import { deleteTaskQuery } from "@/shared/api/task"
export const createRemoveTaskFactory = () => {
  const taskDeleted = createEvent<{ id: string }>()

  const attachDeleteTaskQuery = attachOperation(deleteTaskQuery)

  const deleteTaskFromLsFx = createEffect(({ id }: { id: string }) => {
    const tasksFromLs = localStorage.getItem("tasks")
    const parsedTasks = JSON.parse(tasksFromLs!) as LocalStorageTask[]

    const filteredTasks = parsedTasks.filter((task) => task.id !== id)

    localStorage.setItem("tasks", JSON.stringify(filteredTasks))
    const deletedTask = parsedTasks.find((task) => task.id === id)

    return {
      result: deletedTask!,
    }
  })

  const taskSuccessfullyDeleted = merge([
    deleteTaskFromLsFx.done,
    attachDeleteTaskQuery.finished.success,
  ])

  sample({
    clock: taskDeleted,
    filter: $$session.$isAuthenticated,
    fn: ({ id }) => ({ body: { id } }),
    target: attachDeleteTaskQuery.start,
  })
  sample({
    clock: taskDeleted,
    filter: not($$session.$isAuthenticated),
    target: deleteTaskFromLsFx,
  })
  sample({
    clock: [
      attachDeleteTaskQuery.finished.success,
      deleteTaskFromLsFx.doneData,
    ],
    fn: ({ result }) => result,
    target: $$task.taskDeleted,
  })
  return {
    taskDeleted,
    taskSuccessfullyDeleted,
    _: {
      deleteTaskFromLsFx,
      deleteTaskQuery: attachDeleteTaskQuery,
    },
  }
}
