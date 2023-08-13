import { createTaskFactory } from "@/features/task/create"
import { createRemoveTaskFactory } from "@/features/task/delete"
import { updateTaskFactory } from "@/features/task/update"

import { $taskKv } from "@/entities/task/tasks"

import { createTaskDisclosure } from "@/shared/lib/task-disclosure-factory"

export const $$taskDisclosure = createTaskDisclosure()
export const $$updateTask = updateTaskFactory({ taskModel: $$taskDisclosure })
export const $$createTask = createTaskFactory({
  taskModel: $$taskDisclosure,
  defaultType: "inbox",
  defaultDate: null,
})
export const $$deleteTask = createRemoveTaskFactory()

export const $inboxTasks = $taskKv.map((tasks) =>
  Object.values(tasks).filter((task) => task.type == "inbox"),
)
