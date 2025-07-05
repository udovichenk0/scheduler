import { SpritesMap } from "@/shared/ui/icon/sprite.h"
import { SDate } from "@/shared/lib/date/lib"

import { TaskPriority, TaskStatus, TaskType } from "./model/task.model"

export type TaskId = string
export type Status = (typeof TaskStatus)[keyof typeof TaskStatus]
export type Type = (typeof TaskType)[keyof typeof TaskType]
export type Priority = (typeof TaskPriority)[keyof typeof TaskPriority]

export type Task = {
  id: TaskId
  title: string
  description: Nullable<string>
  status: Status
  type: Type
  start_date: Nullable<SDate>
  due_date: Nullable<SDate>
  user_id: Nullable<string>
  date_created: Date
  is_trashed: boolean
  priority: Priority
}

export type EditableTaskFields = {
  title: string
  description: Nullable<string>
  status: Status
  start_date: Nullable<SDate>
  due_date: Nullable<SDate>
  type: Type
  priority: Priority
}

export type SortType = SpritesMap["sort"]
export type SortConfig = {
  label: string
  value: SortType
}
