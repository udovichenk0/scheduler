import { createEvent, createStore, sample } from "effector"

import { removeTaskFactory } from "@/features/manage-task"

import { $$task } from "@/entities/task/task-item"

import { TaskId } from "@/shared/api/task"
import { getNextTaskId } from "@/shared/lib/effector"

export const $$deleteTask = removeTaskFactory()
export const $trashTasks = $$task.$taskKv.map((kv) => {
  console.log(kv)
  if (kv) return Object.values(kv).filter(({ is_deleted }) => is_deleted)
  return null
})

export const selectTaskId = createEvent<Nullable<TaskId>>()
export const selectNextId = createEvent<TaskId>()
export const $selectedTaskId = createStore<Nullable<TaskId>>(null).on(
  selectTaskId,
  (_, id) => id,
)

sample({
  clock: selectNextId,
  source: $trashTasks,
  fn: (t, id) => {
    const tId = getNextTaskId(t!, id)
    if (tId) return tId
    return null
  },
  target: $selectedTaskId,
})
sample({
  clock: $$deleteTask.taskDeletedById,
  target: selectNextId,
})
