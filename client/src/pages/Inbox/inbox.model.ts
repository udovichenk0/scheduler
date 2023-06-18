import { combine } from "effector";
import { createTaskFactory } from "@/features/task/create";
import { updateTaskFactory } from "@/features/task/update";
import { $tasksKv } from "@/entities/task";
import { taskExpansionFactory } from "@/shared/lib/block-expansion";

export const $tasks = combine($tasksKv, (kv) => {
  return Object.values(kv)
    .filter(({start_date}) => start_date)
})

export const taskModel = taskExpansionFactory()
export const updateTaskModel = updateTaskFactory(taskModel)
export const createTaskModel = createTaskFactory(taskModel)
