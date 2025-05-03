import { dateToUnix } from "@/shared/lib/date/date-to-unix"

import { TaskFields, TaskStatus, TaskType } from "../scheduler.schemas"

export type TaskId = string

type TaskFieldsInput = {
  description: Nullable<string>
  start_date: Nullable<Date>
  due_date: Nullable<Date>
  status: TaskStatus
  title: string
  type: TaskType
}


export const toApiTaskFields = (fields: TaskFieldsInput): TaskFields => {
  const { start_date, due_date } = fields
  return {
    ...fields,
    start_date: start_date ? dateToUnix(start_date) : null,
    due_date: due_date ? dateToUnix(due_date) : null,
  }
}

type UpdateDateInput = {
  startDate: Nullable<Date>
  dueDate: Nullable<Date>
  id: TaskId
}

export const createUpdateDateDto = ({startDate, dueDate, id}:UpdateDateInput) => {
  return {
    start_date: startDate ? dateToUnix(startDate) : null,
    due_date: dueDate ? dateToUnix(dueDate) : null,
    id,
  }
}
