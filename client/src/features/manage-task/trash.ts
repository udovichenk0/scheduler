import { createEvent, sample } from "effector"
import { attachOperation } from "@farfetched/core"

import { $$session } from "@/entities/session/session.model.ts"
import { TaskModel } from "@/entities/task/model/task.model.ts"

import { taskApi } from "@/shared/api/task/task.api.ts"

export const createTaskTrasher = ({ taskModel }: { taskModel: TaskModel }) => {
  const removeTaskById = createEvent<string>()

  const trashTaskAttach = attachOperation(taskApi.trashTaskMutation)

  sample({
    clock: trashTaskAttach.finished.success,
    fn: ({ params: id }) => ({ id, is_trashed: true }),
    target: taskModel.replaceFields,
  })

  sample({
    clock: removeTaskById,
    filter: $$session.$isAuthenticated,
    target: trashTaskAttach.start,
  })

  return {
    removeTaskById,
  }
}
