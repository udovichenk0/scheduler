import { TaskId, TaskStatus, TaskType } from "@/shared/api/task"

export type Task = {
  id: TaskId
  title: string
  description: string
  status: TaskStatus
  type: TaskType
  start_date: Nullable<Date>
  user_id: string | null
}
