import { combine } from "effector"

import { createTaskUpdater } from "@/features/manage-task/update"
import { createTaskRemover } from "@/features/manage-task/trash"
import { createTaskCreator } from "@/features/manage-task/create"

import { isInbox, shouldShowCompleted } from "@/entities/task/lib"
import { createSorting } from "@/entities/task/model/sorting.model"
import { getTaskModelInstance } from "@/entities/task/model/task.model"

import { routes } from "@/shared/routing/router"

export const $$sort = createSorting()

export const $$taskModel = getTaskModelInstance()

export const $inboxTasks = combine(
  $$taskModel.$tasks,
  $$sort.$sortType,
  $$taskModel.$isCompletedShown,
  routes.inbox.$isOpened,
  (tasks, sortType, isCompletedShown, isOpened) => {
    if (!isOpened) return []
    const todayTasks =
      tasks?.filter(
        (task) =>
          isInbox(task) &&
          !task.is_trashed &&
          shouldShowCompleted(isCompletedShown, task),
      ) || []
    return $$sort.sortBy(sortType, todayTasks)
  },
)

export const $$taskRemover = createTaskRemover({ taskModel: $$taskModel })
export const $$updateTask = createTaskUpdater({ taskModel: $$taskModel })
export const $$createTask = createTaskCreator({ taskModel: $$taskModel })
