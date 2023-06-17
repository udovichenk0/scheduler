import { combine, sample } from "effector";
import { and} from "patronum";
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

sample({
  clock: [taskModel.closeTaskTriggered],
  filter: and(createTaskModel.$isAllowToSubmit, updateTaskModel.$isAllowToSubmit),
  target: [taskModel.$newTask.reinit,createTaskModel.resetFieldsTriggered]
})

sample({
  clock: [taskModel.closeTaskTriggered],
  filter: and(createTaskModel.$isAllowToSubmit, updateTaskModel.$isAllowToSubmit, taskModel.$taskId),
  target: [taskModel.$taskId.reinit,updateTaskModel.resetFieldsTriggered]
})