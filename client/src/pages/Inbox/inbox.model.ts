import { disclosureTask } from "@/widgets/expanded-task/model"

import { createRemoveTaskFactory } from "@/features/task/delete"
import { createTaskFactory } from "@/features/task/create"
import { updateTaskFactory } from "@/features/task/update"

import { $$task } from "@/entities/task/task-item"

export const $$deleteTask = createRemoveTaskFactory()

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
