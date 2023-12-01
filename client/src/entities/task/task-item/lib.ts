import { TaskId } from "@/shared/api/task"

import { Task } from "./type"

export const removeTaskFromKv = (kv: Record<string, Task>, taskId: TaskId) => {
  if(!kv) return null
  const updatedTasks = Object.entries(kv).filter(([key]) => key !== taskId)
  return Object.fromEntries(updatedTasks)
}

export const transformTasksToKv = (tasks: Task[]) => {
  return tasks.reduce((kv, task) => ({ ...kv, [task.id]: task }), {})
}

export const addTaskToKv = (kv: Record<string, Task>, task: Task) => {
  if(!kv) return null
  return { ...kv, [task.id]: task }
}
