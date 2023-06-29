import { createTaskFactory } from "@/features/task/create";
import { updateTaskFactory } from "@/features/task/update";
import { taskExpansionFactory } from "@/shared/lib/block-expansion";


export const taskModel = taskExpansionFactory()
export const updateTaskModel = updateTaskFactory({taskModel, defaultType: 'inbox', defaultDate: null})
export const createTaskModel = createTaskFactory({taskModel, defaultType: 'inbox', defaultDate: null})