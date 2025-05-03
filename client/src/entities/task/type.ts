import { SpritesMap } from "@/shared/ui/icon/sprite.h"

import { TaskStatus, TaskType } from "./model/task.model"

export type TaskId = string
export type Status = (typeof TaskStatus)[keyof typeof TaskStatus]
export type Type = (typeof TaskType)[keyof typeof TaskType]

export type Task = {
  id: TaskId
  title: string
  description: Nullable<string>
  status: Status
  type: Type
  start_date: Nullable<Date>
  due_date: Nullable<Date>
  user_id: Nullable<string>
  date_created: Date
  is_trashed: boolean
}

export type EditableTaskFields = {
  title: string
  description: Nullable<string>
  status: Status
  start_date: Nullable<Date>
  due_date: Nullable<Date>
  type: Type
}

export type SortType = SpritesMap["sort"]
export type SortConfig = {
  label: string
  value: SortType
}
