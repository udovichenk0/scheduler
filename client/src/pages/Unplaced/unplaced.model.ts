import { disclosureTask } from "@/widgets/expanded-task/model"

import { removeTaskFactory } from "@/features/manage-task/delete"
import { createTaskFactory } from "@/features/manage-task/create"
import { updateTaskFactory } from "@/features/manage-task/update"

import { $$task } from "@/entities/task/task-item"

import { selectTaskFactory } from "@/shared/lib/effector"
export const $unplacedTasks = $$task.$taskKv.map((kv) => {
  return Object.values(kv).filter(({ type }) => type == "unplaced")
})
export const $$deleteTask = removeTaskFactory()
export const $$updateTask = updateTaskFactory()
export const $$createTask = createTaskFactory({
  defaultType: "unplaced",
  defaultDate: new Date(),
})
export const $$taskDisclosure = disclosureTask({
  tasks: $$task.$taskKv,
  updateTaskModel: $$updateTask,
  createTaskModel: $$createTask,
})
export const $$selectTask = selectTaskFactory($unplacedTasks)
