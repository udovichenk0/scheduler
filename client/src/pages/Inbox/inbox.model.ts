import { updateTaskFactory } from "@/features/manage-task/update"
import { trashTaskFactory } from "@/features/manage-task/trash"
import { createTaskFactory } from "@/features/manage-task/create"

import { createSorting, getTaskModelInstance, modifyTaskFactory } from "@/entities/task"
import { isInbox, shouldShowCompleted } from "@/entities/task/lib"

import { routes } from "@/shared/routing"
import { combine } from "effector"

export const inboxRoute = routes.inbox

export const $$sort = createSorting()

export const $$taskModel = getTaskModelInstance()

export const $inboxTasks = combine($$taskModel.$tasks, $$sort.$sortType, $$taskModel.$isCompletedShown, (tasks, sortType, isCompletedShown) => {
  const todayTasks = tasks?.filter((task) => isInbox(task) && !task.is_trashed && shouldShowCompleted(isCompletedShown, task)) || []
  return $$sort.sortBy(sortType, todayTasks)
})

export const $$trashTask = trashTaskFactory({taskModel: $$taskModel})
export const $$updateTask = updateTaskFactory({taskModel: $$taskModel})
export const $$createTask = createTaskFactory({
  $$modifyTask: modifyTaskFactory({ defaultType: "inbox", defaultDate: null }),
  taskModel: $$taskModel
})