import { createEvent, sample, merge } from "effector"
import { not } from "patronum"

import { $$session } from "@/entities/session"

import { taskApi } from "@/shared/api/task"

export const trashTaskFactory = () => {
  const taskTrashedById = createEvent<string>()

  const taskSuccessfullyDeleted = merge([
    taskApi.trashTaskLs.done,
    taskApi.trashTaskMutation.finished.success,
  ])

  sample({
    clock: taskTrashedById,
    filter: $$session.$isAuthenticated,
    target: taskApi.trashTaskMutation.start,
  })
  sample({
    clock: taskTrashedById,
    filter: not($$session.$isAuthenticated),
    target: taskApi.trashTaskLs,
  })

  return {
    taskTrashedById,
    taskSuccessfullyDeleted,
  }
}

export type TrashTaskFactory = ReturnType<typeof trashTaskFactory>
