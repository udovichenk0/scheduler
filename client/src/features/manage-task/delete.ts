import { createEvent, sample, merge } from "effector"
import { and } from "patronum"

import { $$session } from "@/entities/session"
import { TaskModel } from "@/entities/task"

import { taskApi } from "@/shared/api/task"
import { attachOperation } from "@farfetched/core"
export const removeTaskFactory = (taskModel: TaskModel) => {
  const taskDeletedById = createEvent<string>()
  const allTasksDeleted = createEvent()

  const deleteTrashedTaskAttach = attachOperation(taskApi.deleteTrashedTaskMutation)

  const deleteTrashedTasksAttach = attachOperation(taskApi.deleteTrashedTasksMutation)

  const taskSuccessfullyDeleted = merge([
    deleteTrashedTaskAttach.finished.success,
  ])

  const tasksSuccessfullyDeleted = merge([
    deleteTrashedTasksAttach.finished.success,
  ])

  sample({
    clock:  taskDeletedById,
    filter: $$session.$isAuthenticated,
    fn: (taskId) => ({taskId}),
    target: deleteTrashedTaskAttach.start,
  })
  sample({
    clock: allTasksDeleted,
    filter: and($$session.$isAuthenticated, $$session.$user),
    target: deleteTrashedTasksAttach.start,
  })

  sample({
    clock: taskSuccessfullyDeleted,
    fn: ({ params }) => params.taskId,
    target: taskModel.taskDeleted,
  })

  sample({
    clock: tasksSuccessfullyDeleted,
    source: taskModel.$tasks,
    fn: (tasks) => tasks!.filter((task) => !task.is_trashed),
    target: taskModel.setTasksTriggered
  })

  return {
    taskDeletedById,
    allTasksDeleted,
    taskSuccessfullyDeleted,
  }
}

export type RemoveTaskFactory = ReturnType<typeof removeTaskFactory>
