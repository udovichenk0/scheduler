import { createTaskFactory } from "@/features/task/create"
import { createRemoveTaskFactory } from "@/features/task/delete"
import { updateTaskFactory } from "@/features/task/update"
import { $taskKv } from "@/entities/task/tasks"
import { createTaskAccordionFactory } from "@/shared/lib/task-accordion-factory"

export const $$taskAccordion = createTaskAccordionFactory()
export const $$updateTask = updateTaskFactory({ taskModel: $$taskAccordion })
export const $$createTask = createTaskFactory({
  taskModel: $$taskAccordion,
  defaultType: "unplaced",
  defaultDate: new Date(),
})
export const $$deleteTask = createRemoveTaskFactory()

export const $unplacedTasks = $taskKv.map((kv) => {
  return Object.values(kv).filter(
    ({ type }) => type == 'unplaced'
  )
})