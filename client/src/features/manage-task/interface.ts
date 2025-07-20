import { EventCallable } from "effector"

import { TaskId } from "@/entities/task/type"

export interface TaskRemover {
  removeTaskById: EventCallable<TaskId>
}
