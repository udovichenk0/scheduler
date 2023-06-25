import { combine } from "effector";
import { debug } from "patronum";
import { createTaskFactory } from "@/features/task/create";
import { updateTaskFactory } from "@/features/task/update";
import { $tasksKv } from "@/entities/task";
import { taskExpansionFactory } from "@/shared/lib/block-expansion";

export const $tasks = combine($tasksKv, (kv) => {
  return Object.values(kv)
    .filter(({start_date}) => start_date)
})
debug($tasks)
export const taskModel = taskExpansionFactory()
export const updateTaskModel = updateTaskFactory({taskModel, defaultType: 'inbox'})
export const createTaskModel = createTaskFactory({taskModel, defaultType: 'inbox'})

