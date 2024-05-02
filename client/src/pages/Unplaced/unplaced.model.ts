import { disclosureTask } from "@/widgets/expanded-task/model"

import { createTaskFactory } from "@/features/manage-task/model/create"
import { updateTaskFactory } from "@/features/manage-task/model/update"
import { trashTaskFactory } from "@/features/manage-task/model/trash"

import { modifyTaskFactory } from "@/entities/task/task-form"
import { taskFactory, createSorting } from "@/entities/task/task-item"
import { isUnplaced } from "@/entities/task/task-item/lib"

import { selectTaskFactory } from "@/shared/lib/effector"
import { taskApi } from "@/shared/api/task"
import { routes } from "@/shared/routing"
import { createIdModal, createModal } from "@/shared/lib/modal"
import { getToday } from "@/shared/lib/date"

export const unplacedRoute = routes.unplaced

export const $$dateModal = createModal({})
export const $$idModal = createIdModal()

export const $$sort = createSorting()

export const $unplacedTasks = taskFactory({
  sortModel: $$sort,
  route: unplacedRoute,
  filter: isUnplaced,
  api: {
    taskQuery: taskApi.unplacedTasksQuery,
    taskStorage: taskApi.unplacedTasksLs,
  },
})

export const $$trashTask = trashTaskFactory()

export const $$updateTask = updateTaskFactory()

export const $$createTask = createTaskFactory({
  $$modifyTask: modifyTaskFactory({
    defaultType: "unplaced",
    defaultDate: getToday(),
  }),
})

export const $$taskDisclosure = disclosureTask({
  updateTaskModel: $$updateTask,
  createTaskModel: $$createTask,
})
export const $$selectTask = selectTaskFactory(
  $unplacedTasks.$tasks,
  $$trashTask.taskTrashedById,
)
