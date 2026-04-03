import { createEvent, sample } from "effector"

import { $$session } from "@/entities/session/session.model.ts"
import { TaskModel } from "@/entities/task/model/task.model.ts"

import { taskApi } from "@/shared/api/task/task.api.ts"

export const createTaskTrasher = ({ taskModel }: { taskModel: TaskModel }) => {
  const trashTaskById = createEvent<string>()

  const trashTaskFx = taskApi.trashTaskMutation()

  sample({
    clock: trashTaskFx.finished.success,
    fn: ({ params: id }) => ({ id, is_trashed: true }),
    target: taskModel.replaceFields,
  })

  sample({
    clock: trashTaskById,
    filter: $$session.$isAuthenticated,
    target: trashTaskFx.start,
  })

  return {
    trashTaskById,
  }
}

export type TaskTrasher = ReturnType<typeof createTaskTrasher>
