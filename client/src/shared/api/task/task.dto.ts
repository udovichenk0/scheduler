import { z } from "zod"

export const TaskSchemaDto = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["FINISHED", "INPROGRESS"]),
  start_date: z.coerce.date().nullable(),
  user_id: z.string(),
  type: z.enum(["inbox", "unplaced"]),
  date_created: z.coerce.date(),
})
export const TasksSchemaDto = z.array(TaskSchemaDto)

export type TaskId = string
export type TaskStatus = z.infer<typeof TaskSchemaDto.shape.status>
export type TaskType = z.infer<typeof TaskSchemaDto.shape.type>

export type CreateTaskDto = {
  title: string
  description: string
  status: TaskStatus
  type: TaskType
  start_date: Nullable<Date>
}

export type UpdateTaskDto = {
  id: TaskId
  task: CreateTaskDto
}
export type UpdateStatusDto = {
  id: TaskId
  status: TaskStatus
}
export const LocalStorageTaskDto = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["FINISHED", "INPROGRESS"]),
  start_date: z.coerce.date().nullable(),
  user_id: z.null(),
  type: z.enum(["inbox", "unplaced"]),
  date_created: z.coerce.date(),
})
export const LocalStorageTasksDto = z.array(LocalStorageTaskDto)
export type LocalStorageTaskDto  = z.infer<typeof LocalStorageTaskDto>

export type TaskDto = z.infer<typeof TaskSchemaDto>
