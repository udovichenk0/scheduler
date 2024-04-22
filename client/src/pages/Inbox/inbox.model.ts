import { sample } from "effector"

import { disclosureTask } from "@/widgets/expanded-task/model"

import { updateTaskFactory } from "@/features/manage-task/model/update"
import { trashTaskFactory } from "@/features/manage-task/model/trash"
import { createTaskFactory } from "@/features/manage-task/model/create"

import { taskFactory, createSorting, Task } from "@/entities/task/task-item"

import { selectTaskFactory } from "@/shared/lib/effector"
import { routes } from "@/shared/routing"
import { taskApi } from "@/shared/api/task"
import { createIdModal, createModal } from "@/shared/lib/modal"

export const inboxRoute = routes.inbox
export const $$dateModal = createModal({})
export const $$idModal = createIdModal()

export const $$sort = createSorting()

export const $inboxTasks = taskFactory({
  sortModel: $$sort,
  filter: inboxFilter,
  route: inboxRoute,
  api: {
    taskQuery: taskApi.inboxTasksQuery,
    taskStorage: taskApi.inboxTasksLs,
  },
})

export const $$trashTask = trashTaskFactory()

export const $$updateTask = updateTaskFactory()
export const $$createTask = createTaskFactory({
  defaultType: "inbox",
  defaultDate: null,
})
export const $$taskDisclosure = disclosureTask({
  updateTaskModel: $$updateTask,
  createTaskModel: $$createTask,
})

export const $$selectTask = selectTaskFactory($inboxTasks.$tasks)

sample({
  clock: $$trashTask.taskTrashedById,
  target: $$selectTask.selectNextId,
})

function inboxFilter(task: Task) {
  return task.type == "inbox"
}
