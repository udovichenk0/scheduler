import { combine } from "effector";
import { createTaskFactory } from "@/features/task/create";
import { updateTaskFactory } from "@/features/task/update";
import { $taskKv } from "@/entities/task/tasks";
import { taskExpansionFactory } from "@/shared/lib/block-expansion";


export const taskModel = taskExpansionFactory()
export const updateTaskModel = updateTaskFactory({taskModel, defaultType: 'inbox', defaultDate: null})
export const createTaskModel = createTaskFactory({taskModel, defaultType: 'inbox', defaultDate: null})

export const $inboxTasks = combine($taskKv, (kv) => {
  return Object.values(kv)
    .filter(task => task.type == 'inbox')
})
