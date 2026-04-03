import { combine } from "effector"

import { createTaskDeletion } from "@/features/manage-task/delete"

import { getTaskModelInstance } from "@/entities/task/model/task.model.ts"

import { routes } from "@/shared/routing/router"

const $$taskModel = getTaskModelInstance()

export const $trashTasks = combine(
  $$taskModel.$tasksByListId,
  routes.trash.$isOpened,
  (tasks, isOpened) => {
    if (!isOpened) return []
    return tasks?.filter((task) => task.is_trashed) || []
  },
)

export const $$taskRemover = createTaskDeletion({ taskModel: $$taskModel })
