import { removeTaskFactory } from "@/features/manage-task"

import { taskFactory } from "@/entities/task/task-item"

import { selectTaskFactory } from "@/shared/lib/effector"
import { routes } from "@/shared/routing"
import { taskApi } from "@/shared/api/task"
import { createIdModal } from "@/shared/lib/modal"

export const trashRoute = routes.trash
export const $$idModal = createIdModal()

export const $trashTasks = taskFactory({
  filter: ({ is_deleted }) => is_deleted,
  route: trashRoute,
  api: {
    taskQuery: taskApi.trashTaskQuery,
    taskStorage: taskApi.trashTasksLs,
  },
})
export const $$deleteTask = removeTaskFactory($trashTasks)

export const $$selectTask = selectTaskFactory(
  $trashTasks.$tasks,
  $$deleteTask.taskDeletedById,
)
