import { createEvent, sample, merge } from "effector"

import { $$session } from "@/entities/session/session.model.ts"
import { TaskModel } from "@/entities/task/model/task.model.ts"

import { taskApi } from "@/shared/api/task/task.api.ts"
export const createTaskDeletion = ({ taskModel }: { taskModel: TaskModel }) => {
  const deleteTaskById = createEvent<string>()

  const deleteTrashedTaskFx = taskApi.deleteTrashedTaskMutation()

  const taskSuccessfullyDeleted = merge([deleteTrashedTaskFx.finished.success])
  sample({
    clock: deleteTaskById,
    filter: $$session.$isAuthenticated,
    fn: (taskId) => ({ taskId }),
    target: deleteTrashedTaskFx.start,
  })
  sample({
    clock: taskSuccessfullyDeleted,
    fn: ({ params }) => params.taskId,
    target: taskModel.removeTask,
  })

  return {
    deleteTaskById,
  }
}

export type TaskRemover = ReturnType<typeof createTaskDeletion>
