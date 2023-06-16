import { combine, sample } from "effector";
import { taskModelFactory } from "@/widgets/expanded-task";
import { createTaskFactory } from "@/features/task/create";
import { updateTaskFactory } from "@/features/task/update";
import { $tasksKv } from "@/entities/task";

export const $tasks = combine($tasksKv, (kv) => {
  return Object.values(kv)
    .filter(({start_date}) => start_date)
})

export const taskModel = taskModelFactory()
export const updateTaskModel = updateTaskFactory(taskModel.updateTaskOpened)
export const createTaskModel = createTaskFactory()

sample({
  clock: taskModel.createTaskClosed,
  target: createTaskModel.createTaskTriggered
})

sample({
  clock: taskModel.updateTaskClosed,
  target: updateTaskModel.updateTaskTriggered
})

sample({
  clock: [createTaskModel.taskCreated],
  target: [taskModel.$newTask.reinit]
})
sample({
  clock: [updateTaskModel.taskUpdated],
  target: [taskModel.$taskId.reinit]
})
sample({
  clock: [taskModel.closeTaskTriggered],
  // filter: not(createTaskModel.$isDirty),
  target: [taskModel.reset, createTaskModel.resetFieldsTriggered]
})
