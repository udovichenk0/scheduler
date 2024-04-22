import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { TaskIdSchema, TaskStatusSchema, TaskTypeSchema } from "./common";

export const TaskIdParam = z.object({
  id: TaskIdSchema
});

const CreateTaskSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nullable(),
  status: TaskStatusSchema,
  type: TaskTypeSchema,
  start_date: z.string().pipe(z.coerce.date()).nullable()
});
export class CreateTaskDto extends createZodDto(CreateTaskSchema) {}

const UpdateTaskDateSchema = z.object({
  start_date: z.string().pipe(z.coerce.date()).nullable(),
  type: TaskTypeSchema
});
export class UpdateDateDto extends createZodDto(UpdateTaskDateSchema) {}

export const UpdateTaskStatusSchema = z.object({
  status: TaskStatusSchema
});
export class UpdateStatusDto extends createZodDto(UpdateTaskStatusSchema) {}

export const CreateTasksSchema = z.object({
  tasks: z.array(
    z.object({
      id: z.string(),
      title: z.string().nonempty(),
      description: z.string().nullable(),
      status: TaskStatusSchema,
      start_date: z.string().pipe(z.coerce.date()).nullable(),
      user_id: z.null(),
      type: TaskTypeSchema,
      date_created: z.string().pipe(z.coerce.date()).nullable(),
      is_deleted: z.boolean()
    })
  )
});

export class CreateTasksDto extends createZodDto(CreateTasksSchema) {}
