import { combine, createEvent, restore } from "effector"

import { createTaskCreator } from "@/features/manage-task/create"
import { createTaskUpdater } from "@/features/manage-task/update"
import { createTaskRemover } from "@/features/manage-task/trash"

import { isUnplaced } from "@/entities/task/lib"
import { Task } from "@/entities/task/type"
import { getTaskModelInstance } from "@/entities/task/model/task.model"

import { routes } from "@/shared/routing/router"

export const setMoreTasks = createEvent<Task[]>()
export const $moreTasks = restore(setMoreTasks, [])

export const $$taskModel = getTaskModelInstance()

const $unplacedTasks = combine(
  $$taskModel.$tasks,
  routes.calendar.$isOpened,
  (tasks, isOpened) => {
    if (!isOpened) return []
    return tasks?.filter((task) => isUnplaced(task) && !task.is_trashed) || []
  },
)

export const $$taskUpdater = createTaskUpdater({ taskModel: $$taskModel })
export const $$taskRemover = createTaskRemover({ taskModel: $$taskModel })
export const $$taskCreator = createTaskCreator({
  taskModel: $$taskModel,
})

export const $mappedTasks = $unplacedTasks.map((tasks) => {
  if (!tasks) return null
  return tasks.reduce(
    (acc, task) => {
      const date = task.start_date!.format("YYYY-MM-DD") //!FIX start_date!.
      if (!task.start_date || task.is_trashed) {
        return acc
      }
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(task)
      return acc
    },
    [] as unknown as Record<string, Task[]>,
  )
})
