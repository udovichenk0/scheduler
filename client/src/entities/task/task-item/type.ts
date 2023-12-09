import { TaskId, TaskStatus, TaskType } from "@/shared/api/task"
import { SpritesMap } from "@/shared/ui/icon/sprite.h"

export type Task = {
  id: TaskId
  title: string
  description: string
  status: TaskStatus
  type: TaskType
  start_date: Nullable<Date>
  user_id: Nullable<string>
  date_created: Date
  is_deleted: boolean
}
export type SortType = SpritesMap["sort"]
export type SortConfig = {
  label: string
  value: SortType
}

export type TaskKv = Record<TaskId, Task>