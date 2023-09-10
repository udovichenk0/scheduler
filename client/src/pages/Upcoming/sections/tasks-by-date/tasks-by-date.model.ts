import { $$task } from "@/entities/task/task-item"

export const $todayTasks = $$task.$taskKv.map((kv) => {
  return Object.values(kv)
})
