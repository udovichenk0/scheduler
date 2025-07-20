import { combine, sample } from "effector"

import { createTaskCreator } from "@/features/manage-task/create"
import { createTaskUpdater } from "@/features/manage-task/update"
import { createTaskTrasher } from "@/features/manage-task/trash"

import { tasksToDomain } from "@/entities/task/lib"
import { createTaskModel } from "@/entities/task/model/task.model"

import { taskApi } from "@/shared/api/task/task.api"
import { routes } from "@/shared/routing/router"

export const projectRoute = routes.project

const $$taskModel = createTaskModel()

export const $$taskUpdater = createTaskUpdater({ taskModel: $$taskModel })
export const $$taskCreator = createTaskCreator({ taskModel: $$taskModel })
export const $$taskTrasher = createTaskTrasher({ taskModel: $$taskModel })

export const $projectTasks = combine(
  $$taskModel.$tasks,
  projectRoute.$isOpened,
  (tasks, isOpened) => {
    if (!isOpened || !tasks) return []
    return tasks.filter((t) => !t.is_trashed)
  },
)

sample({
  clock: [routes.project.opened, routes.project.updated],
  source: routes.project.$params,
  fn: (p) => p.projectId,
  target: taskApi.projectTasksQuery.start,
})

sample({
  clock: taskApi.projectTasksQuery.finished.success,
  fn: ({ result }) => tasksToDomain(result),
  target: $$taskModel.$tasks,
})

sample({
  clock: taskApi.projectTasksQuery.finished.failure,
  fn: (test) => {
    console.log(test)
  },
})

//2: when you create task and then trash it, it fails, because you try to delete task with optimistic taskId 5f7de17d-2950-4759-9378-336c79b992d3
