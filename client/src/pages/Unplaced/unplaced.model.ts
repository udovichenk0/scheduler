import { disclosureTask } from "@/widgets/expanded-task/model"

import { createRemoveTaskFactory } from "@/features/task/delete"
import { createTaskFactory } from "@/features/task/create"
import { updateTaskFactory } from "@/features/task/update"

import { $taskKv } from "@/entities/task/tasks"
export const $$deleteTask = createRemoveTaskFactory()
export const $$updateTask = updateTaskFactory()
export const $$createTask = createTaskFactory({
  defaultType: "unplaced",
  defaultDate: new Date(),
})
export const $$taskDisclosure = disclosureTask({
  tasks: $taskKv,
  updateTaskModel: $$updateTask,
  createTaskModel: $$createTask,
})

export const $unplacedTasks = $taskKv.map((kv) => {
  return Object.values(kv).filter(({ type }) => type == "unplaced")
})
