import { combine } from "effector"

import { createTaskCreator } from "@/features/manage-task/create"
import { createTaskUpdater } from "@/features/manage-task/update"
import { createTaskTrasher } from "@/features/manage-task/trash"
import { createProjectManager } from "@/features/manage-project/model"

import { createTaskModel } from "@/entities/task/model/task.model"
import { getProjectModelInstance } from "@/entities/project/model"

import { routes } from "@/shared/routing/router"

export const projectRoute = routes.project

const $$taskModel = createTaskModel()
export const $$projectModel = getProjectModelInstance()
export const $$projectManager = createProjectManager({
  projectModel: $$projectModel,
})

export const $$taskUpdater = createTaskUpdater({ taskModel: $$taskModel })
export const $$taskCreator = createTaskCreator({ taskModel: $$taskModel })
export const $$taskTrasher = createTaskTrasher({ taskModel: $$taskModel })

export const $projectTasks = combine(
  $$taskModel.$tasks,
  projectRoute.$isOpened,
  projectRoute.$params,
  (tasks, isOpened, params) => {
    if (!isOpened || !tasks) return []
    return tasks.filter((t) => !t.is_trashed)
  },
)

// sample({
//   clock: [routes.project.opened, routes.project.updated],
//   source: routes.project.$params,
//   fn: (p) => p.projectId,
//   target: taskApi.projectTasksQuery.start,
// })

// sample({
//   clock: taskApi.projectTasksQuery.finished.success,
//   fn: ({ result }) => tasksToDomain(result),
//   target: $$taskModel.$tasks,
// })

// sample({
//   clock: taskApi.projectTasksQuery.finished.failure,
//   fn: (test) => {
//     console.log(test)
//   },
// })
