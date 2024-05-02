import { TaskId, TaskType } from "@/shared/api/task"

import { Task } from "./type"
import { TaskTypes } from "./config"

export const tasksNotNull = (tasks: Nullable<Task[]>): tasks is Task[] =>
  tasks != null
export const findTaskById = (tasks: Task[], id: TaskId) =>
  tasks.find((task) => task.id === id)!

export const switchTaskType = (type: TaskType, date?: Date): TaskType => {
  switch (true) {
    case type === TaskTypes.INBOX && !!date:
      return TaskTypes.UNPLACED
    case type === TaskTypes.UNPLACED && !date:
      return TaskTypes.INBOX
    default:
      return TaskTypes.INBOX
  }
}

export function deleteById(tasks: Task[], deletedTaskId: TaskId) {
  return tasks.filter((task) => task.id != deletedTaskId)
}

export const isUnplaced = (task: Task) => task.type == "unplaced"

export const isInbox = (task: Task) => task.type == "inbox"
