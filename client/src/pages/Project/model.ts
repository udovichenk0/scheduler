import { sample } from "effector"

import { createTaskFactory } from "@/features/manage-task/create"
import { updateTaskFactory } from "@/features/manage-task/update"

import { tasksToDomain } from "@/entities/task/lib"
import { modifyTaskFactory } from "@/entities/task/model/modify.model"
import { createTaskModel } from "@/entities/task/model/task.model"

import { taskApi } from "@/shared/api/task/task.api"
import { routes } from "@/shared/routing/router"

export const projectRoute = routes.project

export const $$taskModel = createTaskModel()

export const $$updateTask = updateTaskFactory({ taskModel: $$taskModel })
export const $$createTask = createTaskFactory({
  $$modifyTask: modifyTaskFactory({}),
  taskModel: $$taskModel,
})

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
