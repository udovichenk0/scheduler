import dayjs from "dayjs"
import { combine, createEvent, restore } from "effector"

import { createTaskFactory } from "@/features/manage-task/create"
import { updateTaskFactory } from "@/features/manage-task/update"
import { trashTaskFactory } from "@/features/manage-task/trash"

import { Task, $$taskModel, modifyTaskFactory } from "@/entities/task"
import { isUnplaced } from "@/entities/task/lib"

import { routes } from "@/shared/routing"
import { getToday } from "@/shared/lib/date"

export const calendarRoute = routes.calendar

export const setMoreTasks = createEvent<Task[]>()
export const $moreTasks = restore(setMoreTasks, [])

export const $$trashTask = trashTaskFactory({taskModel: $$taskModel})

const $unplacedTasks = combine($$taskModel.$tasks, (tasks) => {
  return tasks?.filter((task) => isUnplaced(task) && !task.is_trashed) || []
})

export const $$updateTask = updateTaskFactory({taskModel: $$taskModel})
export const $$createTask = createTaskFactory({
  $$modifyTask: modifyTaskFactory({
    defaultType: "unplaced",
    defaultDate: getToday(),
  }),
  taskModel: $$taskModel
})

export const $mappedTasks = $unplacedTasks.map((tasks) => {
  if (!tasks) return null
  return tasks.reduce(
    (acc, task) => {
      const date = dayjs(task.start_date).format("YYYY-MM-DD")
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