import { combine } from "effector"

import { createTaskCreator } from "@/features/manage-task/create"
import { createTaskUpdater } from "@/features/manage-task/update"
import { createTaskRemover } from "@/features/manage-task/trash"

import { isUnplaced, shouldShowCompleted } from "@/entities/task/lib"
import { createSorting } from "@/entities/task/model/sorting.model"
import { getTaskModelInstance } from "@/entities/task/model/task.model"

import { routes } from "@/shared/routing/router"

export const $$sort = createSorting()

export const $$taskModel = getTaskModelInstance()
export const $$trashTask = createTaskRemover({ taskModel: $$taskModel })
export const $$taskUpdater = createTaskUpdater({ taskModel: $$taskModel })
export const $$taskCreator = createTaskCreator({ taskModel: $$taskModel })

export const $unplacedTasks = combine(
  $$taskModel.$tasks,
  $$taskModel.$isCompletedShown,
  routes.unplaced.$isOpened,
  (tasks, isCompletedShown, isOpened) => {
    if (!isOpened) return []
    return (
      tasks?.filter(
        (task) =>
          isUnplaced(task) &&
          !task.is_trashed &&
          shouldShowCompleted(isCompletedShown, task),
      ) || []
    )
  },
)
