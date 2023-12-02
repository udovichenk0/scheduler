import { TaskId, TaskType } from "@/shared/api/task"

import { Task, TaskKv } from "./type"
import { TaskTypes } from "./config"

export const removeTaskFromKv = (kv: TaskKv, taskId: TaskId) => {
  if(!kv) return null
  const updatedTasks = Object.entries(kv).filter(([key]) => key !== taskId)
  return Object.fromEntries(updatedTasks)
}

export const transformTasksToKv = (tasks: Task[]) => {
  return tasks.reduce((kv, task) => ({ ...kv, [task.id]: task }), {})
}

export const addTaskToKv = (kv: TaskKv, task: Task) => {
  if(!kv) return null
  return { ...kv, [task.id]: task }
}

export const switchTaskType = (type: TaskType, date?: Date): TaskType => {
  switch(true){
    case type === TaskTypes.INBOX && !!date: 
      return TaskTypes.UNPLACED
    case type === TaskTypes.UNPLACED && !date:
      return TaskTypes.INBOX
    default: 
      return TaskTypes.INBOX
  }
}