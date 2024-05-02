import { disclosureTask } from "@/widgets/expanded-task/model"

import { updateTaskFactory } from "@/features/manage-task/model/update"
import { trashTaskFactory } from "@/features/manage-task/model/trash"
import { createTaskFactory } from "@/features/manage-task/model/create"

import { taskFactory, createSorting } from "@/entities/task/task-item"
import { isInbox } from "@/entities/task/task-item/lib"
import { modifyTaskFactory } from "@/entities/task/task-form"

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
  filter: isInbox,
  route: inboxRoute,
  api: {
    taskQuery: taskApi.inboxTasksQuery,
    taskStorage: taskApi.inboxTasksLs,
  },
})

export const $$trashTask = trashTaskFactory()

export const $$updateTask = updateTaskFactory()
export const $$createTask = createTaskFactory({
  $$modifyTask: modifyTaskFactory({ defaultType: "inbox", defaultDate: null }),
})
export const $$taskDisclosure = disclosureTask({
  updateTaskModel: $$updateTask,
  createTaskModel: $$createTask,
})

export const $$selectTask = selectTaskFactory(
  $inboxTasks.$tasks,
  $$trashTask.taskTrashedById,
)
