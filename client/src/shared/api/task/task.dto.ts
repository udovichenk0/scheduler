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
  is_deleted: z.boolean(),
})
export const BatchedSchemaDto = z.object({count: z.number()})
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

export type CreateTasksDto = {
  tasks: CreateTaskDto[]
}
export type UpdateDateDto = { 
  data: { 
    start_date: Date; 
    type: TaskType 
  }
  id: TaskId 
}


export type UpdateTaskDto = {
  data: CreateTaskDto,
  id: TaskId
}
export type UpdateStatusDto = {
  data: {
    status: TaskStatus
  }
  id: TaskId
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
  is_deleted: z.boolean(),
})
export const LocalStorageTasksDto = z.array(LocalStorageTaskDto)
export type LocalStorageTaskDto = z.infer<typeof LocalStorageTaskDto>

export type TaskDto = z.infer<typeof TaskSchemaDto>
