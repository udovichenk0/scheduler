import { combine } from "effector"

import { createTaskFactory } from "@/features/manage-task/create"
import { updateTaskFactory } from "@/features/manage-task/update"
import { trashTaskFactory } from "@/features/manage-task/trash"

import { isUnplaced, shouldShowCompleted } from "@/entities/task/lib"
import { createSorting } from "@/entities/task/model/sorting.model"
import { getTaskModelInstance } from "@/entities/task/model/task.model"
import { modifyTaskFactory } from "@/entities/task/model/modify.model.ts"

import { getToday } from "@/shared/lib/date/lib"

export const $$sort = createSorting()

export const $$taskModel = getTaskModelInstance()

export const $unplacedTasks = combine(
  $$taskModel.$tasks,
  $$taskModel.$isCompletedShown,
  (tasks, isCompletedShown) => {
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

export const $$trashTask = trashTaskFactory({ taskModel: $$taskModel })

export const $$updateTask = updateTaskFactory({ taskModel: $$taskModel })

export const $$createTask = createTaskFactory({
  $$modifyTask: modifyTaskFactory({
    defaultType: "unplaced",
    defaultDate: getToday(),
  }),
  taskModel: $$taskModel,
})
