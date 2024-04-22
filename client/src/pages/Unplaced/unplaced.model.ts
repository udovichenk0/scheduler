import { sample } from "effector"

import { disclosureTask } from "@/widgets/expanded-task/model"

import { createTaskFactory } from "@/features/manage-task/model/create"
import { updateTaskFactory } from "@/features/manage-task/model/update"
import { trashTaskFactory } from "@/features/manage-task/model/trash"

import { taskFactory, createSorting } from "@/entities/task/task-item"

import { selectTaskFactory } from "@/shared/lib/effector"
import { taskApi } from "@/shared/api/task"
import { routes } from "@/shared/routing"
import { createIdModal, createModal } from "@/shared/lib/modal"

export const unplacedRoute = routes.unplaced

export const $$dateModal = createModal({})
export const $$idModal = createIdModal()

export const $$sort = createSorting()
export const $unplacedTasks = taskFactory({
  sortModel: $$sort,
  route: unplacedRoute,
  filter: ({ type }) => type == "unplaced",
  api: {
    taskQuery: taskApi.unplacedTasksQuery,
    taskStorage: taskApi.unplacedTasksLs,
  },
})

export const $$trashTask = trashTaskFactory()

export const $$updateTask = updateTaskFactory()

export const $$createTask = createTaskFactory({
  defaultType: "unplaced",
  defaultDate: new Date(),
})

export const $$taskDisclosure = disclosureTask({
  updateTaskModel: $$updateTask,
  createTaskModel: $$createTask,
})
export const $$selectTask = selectTaskFactory($unplacedTasks.$tasks)

sample({
  clock: $$trashTask.taskTrashedById,
  target: $$selectTask.selectNextId,
})
