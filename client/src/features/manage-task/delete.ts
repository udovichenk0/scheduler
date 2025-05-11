import { createEvent, sample, merge } from "effector"
import { and } from "patronum"
import { attachOperation } from "@farfetched/core"

import { $$session } from "@/entities/session/session.model.ts"
import { TaskModel } from "@/entities/task/model/task.model.ts"

import { taskApi } from "@/shared/api/task/task.api.ts"
export const removeTaskFactory = (taskModel: TaskModel) => {
  const taskDeletedById = createEvent<string>()
  const allTasksDeleted = createEvent()

  const deleteTrashedTaskAttach = attachOperation(
    taskApi.deleteTrashedTaskMutation,
  )

  const deleteTrashedTasksAttach = attachOperation(
    taskApi.deleteTrashedTasksMutation,
  )

  const taskSuccessfullyDeleted = merge([
    deleteTrashedTaskAttach.finished.success,
  ])

  const tasksSuccessfullyDeleted = merge([
    deleteTrashedTasksAttach.finished.success,
  ])

  sample({
    clock: taskDeletedById,
    filter: $$session.$isAuthenticated,
    fn: (taskId) => ({ taskId }),
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
    target: taskModel.setTasksTriggered,
  })

  return {
    taskDeletedById,
    allTasksDeleted,
    taskSuccessfullyDeleted,
  }
}
