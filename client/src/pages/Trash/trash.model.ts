import { removeTaskFactory } from "@/features/manage-task/delete"

import { $$taskModel } from "@/entities/task"

import { routes } from "@/shared/routing"
import { combine } from "effector"

export const trashRoute = routes.trash

export const $trashTasks = combine($$taskModel.$tasks, (tasks) => {
  return tasks?.filter((task) => task.is_trashed) || []
})

export const $$deleteTask = removeTaskFactory($$taskModel)
