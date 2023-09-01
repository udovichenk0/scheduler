import { $$task } from "@/entities/task/tasks"

export const $todayTasks = $$task.$taskKv.map((kv) => {
  return Object.values(kv)
})
