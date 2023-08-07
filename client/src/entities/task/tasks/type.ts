type TaskStatus = "FINISHED" | "INPROGRESS"
type TaskType = "inbox" | "unplaced"
export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  type: TaskType
  start_date: Nullable<Date>
  user_id: string
}
