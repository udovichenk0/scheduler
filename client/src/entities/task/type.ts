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
  list_id: ProjectId
  date_created: SDate
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
}

export type SortType =
  | "alph_asc"
  | "alph_desc"
  | "date_created_asc"
  | "time_asc"
  | "time_desc"
export type SortConfig = {
  label: string
  value: SortType
}
