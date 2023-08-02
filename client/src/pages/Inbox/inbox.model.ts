import { createTaskFactory } from "@/features/task/create"
import { createRemoveTaskFactory } from "@/features/task/delete"
import { updateTaskFactory } from "@/features/task/update"
import { $taskKv } from "@/entities/task/tasks"
import { createTaskAccordionFactory } from "@/shared/lib/task-accordion-factory"

export const taskAccordion = createTaskAccordionFactory()
export const updateTaskModel = updateTaskFactory({ taskModel: taskAccordion })
export const createTaskModel = createTaskFactory({
  taskModel: taskAccordion,
  defaultType: "inbox",
  defaultDate: null,
})
export const $$deleteTask = createRemoveTaskFactory()

export const $inboxTasks = $taskKv.map((tasks) =>
  Object.values(tasks).filter((task) => task.type == "inbox"),
)