import { sample } from "effector"

import { removeTaskFactory } from "@/features/manage-task"

import { $$task } from "@/entities/task/task-item"

import { selectTaskFactory } from "@/shared/lib/effector"

export const $$deleteTask = removeTaskFactory()
export const $trashTasks = $$task.$taskKv.map((kv) => {
  if (kv) return Object.values(kv).filter(({ is_deleted }) => is_deleted)
  return null
})

export const $$selectTask = selectTaskFactory($trashTasks)

sample({
  clock: $$deleteTask.taskDeletedById,
  target: $$selectTask.selectNextId,
})