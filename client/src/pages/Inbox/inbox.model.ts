import { sample } from "effector"

import { disclosureTask } from "@/widgets/expanded-task/model"

import { removeTaskFactory } from "@/features/manage-task/model/delete"
import { createTaskFactory } from "@/features/manage-task/model/create"
import { updateTaskFactory } from "@/features/manage-task/model/update"

import { $$task } from "@/entities/task/task-item"

import { selectTaskFactory } from "@/shared/lib/effector/task-selection"

export const $$deleteTask = removeTaskFactory()

export const $inboxTasks = $$task.$taskKv.map((tasks) =>
  Object.values(tasks).filter((task) => task.type == "inbox"),
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
  clock: $$deleteTask.taskDeletedById,
  target: $$selectTask.nextTaskIdSelected,
})
