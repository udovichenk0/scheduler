import { combine, sample } from "effector"

import { disclosureTask } from "@/widgets/expanded-task/model"

import { createTaskFactory } from "@/features/manage-task/model/create"
import { updateTaskFactory } from "@/features/manage-task/model/update"
import { trashTaskFactory } from "@/features/manage-task/model/trash"

import { $$task, createSorting } from "@/entities/task/task-item"

import { selectTaskFactory } from "@/shared/lib/effector/task-selection"

export const $$trashTask = trashTaskFactory()

export const $$sort = createSorting()
export const $inboxTasks = combine(
  $$task.$taskKv,
  $$sort.$sortType,
  (kv, sortType) => {
    if (!kv) return null
    const tasks = Object.values(kv).filter(
      ({ type, is_deleted }) => type == "inbox" && !is_deleted,
    )
    return $$sort.sortBy(sortType, tasks)
  },
)

export const $$updateTask = updateTaskFactory()
export const $$createTask = createTaskFactory({
  defaultType: "inbox",
  defaultDate: null,
})
export const $$taskDisclosure = disclosureTask({
  tasks: $$task.$taskKv,
  updateTaskModel: $$updateTask,
  createTaskModel: $$createTask,
})

export const $$selectTask = selectTaskFactory($inboxTasks)

sample({
  clock: $$trashTask.taskTrashedById,
  target: $$selectTask.selectNextId,
})
