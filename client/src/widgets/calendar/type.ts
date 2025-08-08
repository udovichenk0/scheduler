import { Task } from "@/entities/task/type"

export type Cell = {
  tasks: {
    task: Task
    range: number
  }[]
  stub: number
}
