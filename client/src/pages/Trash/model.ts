import { combine } from "effector"

import { removeTaskFactory } from "@/features/manage-task/delete"

import { $$taskModel } from "@/entities/task/model/task.model.ts"

export const $trashTasks = combine($$taskModel.$tasks, (tasks) => {
  return tasks?.filter((task) => task.is_trashed) || []
})

export const $$deleteTask = removeTaskFactory($$taskModel)
