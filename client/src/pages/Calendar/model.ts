import { combine, createEvent, restore } from "effector"

import { createTaskFactory } from "@/features/manage-task/create"
import { updateTaskFactory } from "@/features/manage-task/update"
import { trashTaskFactory } from "@/features/manage-task/trash"

import { modifyTaskFactory } from "@/entities/task/model/modify.model.ts"
import { isUnplaced } from "@/entities/task/lib"
import { Task } from "@/entities/task/type"
import { getTaskModelInstance } from "@/entities/task/model/task.model"

import { getToday } from "@/shared/lib/date/lib"

export const setMoreTasks = createEvent<Task[]>()
export const $moreTasks = restore(setMoreTasks, [])

export const $$taskModel = getTaskModelInstance()

export const $$trashTask = trashTaskFactory({ taskModel: $$taskModel })

const $unplacedTasks = combine($$taskModel.$tasks, (tasks) => {
  return tasks?.filter((task) => isUnplaced(task) && !task.is_trashed) || []
})

export const $$updateTask = updateTaskFactory({ taskModel: $$taskModel })
export const $$createTask = createTaskFactory({
  $$modifyTask: modifyTaskFactory({
    defaultType: "unplaced",
    defaultDate: getToday(),
  }),
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
