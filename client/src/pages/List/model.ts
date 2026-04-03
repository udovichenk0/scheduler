import { combine, sample } from "effector"

import { createTaskCreator } from "@/features/manage-task/create"
import { createTaskUpdater } from "@/features/manage-task/update"
import { createTaskTrasher } from "@/features/manage-task/trash"
import { createProjectManager } from "@/features/manage-project/model"

import { createTaskModel } from "@/entities/task/model/task.model"
import { getProjectModelInstance } from "@/entities/project/model"

import { routes } from "@/shared/routing/router"
import { taskApi } from "@/shared/api/task/task.api"
import { listApi } from "@/shared/api/list/api"

export const listRoute = routes.list

const $$taskModel = createTaskModel()
export const $$projectModel = getProjectModelInstance()
export const $$projectManager = createProjectManager({
  projectModel: $$projectModel,
})

export const $$taskUpdater = createTaskUpdater({ taskModel: $$taskModel })
export const $$taskCreator = createTaskCreator({ taskModel: $$taskModel })
export const $$taskTrasher = createTaskTrasher({ taskModel: $$taskModel })

export const $listTasks = combine(
  $$taskModel.$tasksByListId,
  listRoute.$params,
  (tasksByListId, params) => {
    const tasks = tasksByListId[params.listId]
    if (!tasks) return []
    return tasks
  },
)

sample({
  clock: listRoute.opened,
  source: listRoute.$params,
  fn: ({ listId }) => listId,
  target: taskApi.tasksByListIdQuery.start,
})

sample({
  clock: listRoute.opened,
  source: listRoute.$params,
  fn: ({ listId }) => listId,
  target: listApi.listsQuery.start,
})
