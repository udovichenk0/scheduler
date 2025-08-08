import { SpritesMeta } from "@/shared/ui/icon/sprite.h"
import { SDate } from "@/shared/lib/date/lib"

import { TaskPriority, TaskStatus, TaskType } from "./model/task.model"

export type TaskId = string
export type ProjectId = string
export type Status = (typeof TaskStatus)[keyof typeof TaskStatus]
export type Type = (typeof TaskType)[keyof typeof TaskType]
export type Priority = (typeof TaskPriority)[keyof typeof TaskPriority]
export type TaskDate = Nullable<SDate>

export type Task = {
  id: TaskId
  title: string
  description: Nullable<string>
  status: Status
  type: Type
  start_date: TaskDate
  due_date: TaskDate
  user_id: Nullable<string>
  project_id: Nullable<ProjectId>
  date_created: Date
  is_trashed: boolean
  priority: Priority
}

export type EditableTaskFields = {
  title: string
  description: Nullable<string>
  status: Status
  start_date: TaskDate
  due_date: TaskDate
  type: Type
  priority: Priority
  project_id: Nullable<ProjectId>
}

export type SortType = SpritesMeta["sort"]
export type SortConfig = {
  label: string
  value: SortType
}
