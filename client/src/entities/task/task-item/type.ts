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
}
export type SortType = SpritesMap["filter"]
export type FilterConfig = {
  label: string
  value: SortType
}
