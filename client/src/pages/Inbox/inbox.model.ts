import { combine } from "effector";
import { debug } from "patronum";
import { createTaskFactory } from "@/features/task/create";
import { updateTaskFactory } from "@/features/task/update";
import { $tasksKv } from "@/entities/task";
import { taskExpansionFactory } from "@/shared/lib/block-expansion";

export const $tasks = combine($tasksKv, (kv) => {
  return Object.values(kv)
    .filter(({type}) => type === 'inbox')
})
debug($tasks)
export const taskModel = taskExpansionFactory()
export const updateTaskModel = updateTaskFactory({taskModel, defaultType: 'inbox', defaultDate: null})
export const createTaskModel = createTaskFactory({taskModel, defaultType: 'inbox', defaultDate: null})