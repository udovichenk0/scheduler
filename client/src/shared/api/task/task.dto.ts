import { SDate } from "@/shared/lib/date/lib"

import { TaskFields, TaskStatus, TaskType } from "../scheduler.schemas"

export type TaskId = string

type TaskFieldsInput = {
  description: Nullable<string>
  start_date: Nullable<SDate>
  due_date: Nullable<SDate>
  status: TaskStatus
  title: string
  type: TaskType
}

export const toApiTaskFields = (fields: TaskFieldsInput): TaskFields => {
  const { start_date, due_date } = fields
  return {
    ...fields,
    start_date: start_date ? start_date.toUnix() : null,
    due_date: due_date ? due_date.toUnix() : null,
  }
}

type UpdateDateInput = {
  startDate: Nullable<SDate>
  dueDate: Nullable<SDate>
  id: TaskId
}

export const createUpdateDateDto = ({
  startDate,
  dueDate,
  id,
}: UpdateDateInput) => {
  return {
    start_date: startDate ? startDate.toUnix() : null,
    due_date: dueDate ? dueDate.toUnix() : null,
    id,
  }
}

export function unixToDate(strDate: number | null) {
  if (!strDate) {
    return null
  }
  return new Date(strDate * 1000)
}
