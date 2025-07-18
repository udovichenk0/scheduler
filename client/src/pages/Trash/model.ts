import { combine } from "effector"

import { removeTaskFactory } from "@/features/manage-task/delete"

import { getTaskModelInstance } from "@/entities/task/model/task.model.ts"

const $$taskModel = getTaskModelInstance()

export const $trashTasks = combine($$taskModel.$tasks, (tasks) => {
  return tasks?.filter((task) => task.is_trashed) || []
})

export const $$deleteTask = removeTaskFactory($$taskModel)
