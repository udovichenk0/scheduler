import { combine, sample } from "effector"

import { createTaskUpdater } from "@/features/manage-task/update"
import { createTaskTrasher } from "@/features/manage-task/trash"
import { createTaskCreator } from "@/features/manage-task/create"

import { shouldShowCompleted } from "@/entities/task/lib"
import { createSorting } from "@/entities/task/model/sorting.model"
import { getTaskModelInstance } from "@/entities/task/model/task.model"

import { routes } from "@/shared/routing/router"
import { taskApi } from "@/shared/api/task/task.api"
import { not } from "patronum"
import { projectApi } from "@/shared/api/project/api"
import { getProjectModelInstance } from "@/entities/project/model"

export const $$sort = createSorting()
export const $$taskModel = getTaskModelInstance()

// export const $$listModel = getListModelInstance()
export const $$projectModel = getProjectModelInstance()

export const homeroute = routes.home2

sample({
  clock: homeroute.opened,
  filter: not($$projectModel.$privateProject),
  target: projectApi.privateProjectQuery.start,
})

sample({
  clock: projectApi.privateProjectQuery.finished.success,
  fn: ({ result }) => result.id,
  target: taskApi.tasksByListIdQuery.start,
})

export const $privateTasks = combine(
  $$taskModel.$tasksByListId,
  $$projectModel.$privateProject,
  $$sort.$sortType,
  $$taskModel.$isCompletedShown,
  routes.home2.$isOpened,
  (tasksByListId, privateProject, sortType, isCompletedShown, isOpened) => {
    if (!isOpened || !privateProject) return []
    const listId = privateProject.list.id
    const tasks = tasksByListId[listId]
    const privateTasks =
      tasks.filter(
        (task) =>
          !task.is_trashed && shouldShowCompleted(isCompletedShown, task),
      ) || []
    return $$sort.sortBy(sortType, privateTasks)
  },
)

export const $$taskTrasher = createTaskTrasher({ taskModel: $$taskModel })
export const $$taskUpdater = createTaskUpdater({ taskModel: $$taskModel })
export const $$taskCreator = createTaskCreator({ taskModel: $$taskModel })
