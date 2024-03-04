import { combine, sample } from "effector"

import { disclosureTask } from "@/widgets/expanded-task/model"

import { createTaskFactory } from "@/features/manage-task/model/create"
import { updateTaskFactory } from "@/features/manage-task/model/update"
import { trashTaskFactory } from "@/features/manage-task/model/trash"

import { $$task, createSorting } from "@/entities/task/task-item"

import { selectTaskFactory } from "@/shared/lib/effector"

export const $$sort = createSorting()
export const $unplacedTasks = combine(
  $$task.$tasks,
  $$sort.$sortType,
  (tasks, sortType) => {
    if (!tasks) return null
    const unplacedTasks = tasks.filter(
      ({ type, is_deleted }) => type == "unplaced" && !is_deleted,
    )
    return $$sort.sortBy(sortType, unplacedTasks)
  },
)

export const $$trashTask = trashTaskFactory()
export const $$updateTask = updateTaskFactory()
export const $$createTask = createTaskFactory({
  defaultType: "unplaced",
  defaultDate: new Date(),
})
export const $$taskDisclosure = disclosureTask({
  $tasks: $$task.$tasks,
  updateTaskModel: $$updateTask,
  createTaskModel: $$createTask,
})
export const $$selectTask = selectTaskFactory($unplacedTasks)

sample({
  clock: $$trashTask.taskTrashedById,
  target: $$selectTask.selectNextId,
})