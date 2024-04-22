import { createEvent, sample, merge } from "effector"
import { not } from "patronum"

import { $$session } from "@/entities/session"
import { TaskFactory } from "@/entities/task/task-item"

import { taskApi } from "@/shared/api/task"
export const removeTaskFactory = (taskModel: TaskFactory) => {
  const taskDeletedById = createEvent<string>()
  const allTasksDeleted = createEvent()

  const taskSuccessfullyDeleted = merge([
    taskApi.deleteTaskLs.doneData,
    taskApi.deleteTaskMutation.finished.success,
  ])
  sample({
    clock: taskDeletedById,
    filter: $$session.$isAuthenticated,
    target: taskApi.deleteTaskMutation.start,
  })
  sample({
    clock: allTasksDeleted,
    filter: $$session.$isAuthenticated,
    target: taskApi.deleteAllTasksMutation.start,
  })

  sample({
    clock: taskDeletedById,
    filter: not($$session.$isAuthenticated),
    target: taskApi.deleteTaskLs,
  })
  sample({
    clock: allTasksDeleted,
    filter: not($$session.$isAuthenticated),
    target: taskApi.deleteTasksFromLocalStorageFx,
  })

  sample({
    clock: taskApi.deleteTaskMutation.finished.success,
    fn: ({ result }) => result.id,
    target: taskModel.taskDeleted,
  })
  sample({
    clock: [
      taskApi.trashTaskMutation.finished.success,
      taskApi.trashTaskLs.doneData,
    ],
    fn: ({ result }) => result,
    target: taskModel.addTaskTriggered,
  })
  sample({
    clock: [
      taskApi.deleteTaskMutation.finished.success,
      taskApi.deleteTaskLs.doneData,
    ],
    fn: ({ result }) => result.id,
    target: taskModel.taskDeleted,
  })
  sample({
    clock: [
      taskApi.deleteAllTasksMutation.finished.success,
      taskApi.deleteTasksFromLocalStorageFx.done,
    ],
    target: taskModel.reset,
  })
  return {
    taskDeletedById,
    allTasksDeleted,
    taskSuccessfullyDeleted,
  }
}

export type RemoveTaskFactory = ReturnType<typeof removeTaskFactory>
