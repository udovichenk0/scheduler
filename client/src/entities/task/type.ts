import { SpritesMap } from "@/shared/ui/icon/sprite.h"
import { TaskStatus, TaskType } from "./model/task.model"

export type TaskId = string
export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus]
export type TaskType = typeof TaskType[keyof typeof TaskType]

export type Task = {
  id: TaskId
  title: string
  description: Nullable<string>
  status: TaskStatus
  type: TaskType
  start_date: Nullable<Date>
  user_id: Nullable<string>
  date_created: Date
  is_trashed: boolean
}

export type EditableTaskFields = {
  title: string
  description: Nullable<string>
  status: TaskStatus
  start_date: Nullable<Date>
  type: TaskType
}

export type SortType = SpritesMap["sort"]
export type SortConfig = {
  label: string
  value: SortType
}
