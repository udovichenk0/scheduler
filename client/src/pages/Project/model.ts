import { tasksToDomain } from "@/entities/task/lib";
import { modifyTaskFactory } from "@/entities/task/model/modify.model";
import { getTaskModelInstance } from "@/entities/task/model/task.model";
import { Task } from "@/entities/task/type";
import { createTaskFactory } from "@/features/manage-task/create";
import { updateTaskFactory } from "@/features/manage-task/update";
import { taskApi } from "@/shared/api/task/task.api";
import { routes } from "@/shared/routing/router";
import { createStore, sample } from "effector";
export const projectRoute = routes.project
export const $$taskModel = getTaskModelInstance()

export const $$updateTask = updateTaskFactory({taskModel: $$taskModel})
export const $$createTask = createTaskFactory({ 
  $$modifyTask: modifyTaskFactory({}),
  taskModel: $$taskModel,
})

export const $projectTasks = createStore<Nullable<Task[]>>([])

sample({
  clock: [routes.project.opened, routes.project.updated],
  source: routes.project.$params,
  fn: (p) => p.projectId,
  target: taskApi.projectTasksQuery.start
})

sample({
  clock: taskApi.projectTasksQuery.finished.success,
  fn: ({result}) => tasksToDomain(result),
  target: $projectTasks
})

sample({
  clock: taskApi.projectTasksQuery.finished.failure,
  fn: (test) => {
    console.log(test)
  },
  // target: $projectTasks
})

