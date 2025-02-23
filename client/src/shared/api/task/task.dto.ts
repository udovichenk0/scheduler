import { dateToUnix } from "@/shared/lib/date/date-to-unix";
import { TaskFields, TaskStatus, TaskType } from "../scheduler.schemas"

export type TaskId = string

type TaskFieldsInput = {
  description: Nullable<string>;
  start_date: Nullable<Date>;
  status: TaskStatus;
  title: string;
  type: TaskType;
}

export const toApiTaskFields = (fields: TaskFieldsInput): TaskFields => {
  const {start_date} = fields
  return {
    ...fields,
    start_date: start_date ? dateToUnix(start_date) : null
  }
}