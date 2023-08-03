import { createEvent, sample } from "effector"
import { $taskKv } from "@/entities/task/tasks"
import { deleteTaskQuery } from "@/shared/api/task"

export const createRemoveTaskFactory = () => {
  const taskDeleted = createEvent<{ id: number }>()

  sample({
    clock: taskDeleted,
    fn: ({ id }) => ({ body: { id } }),
    target: deleteTaskQuery.start,
  })

  sample({
    clock: deleteTaskQuery.finished.success,
    source: $taskKv,
    fn: (kv, { result: { result } }) => {
      return Object.values(kv).filter((task) => task.id !== result.id)
    },
    target: $taskKv,
  })

  return {
    taskDeleted,
  }
}
